import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { stringToHex } from '@src/utils'

export type UsbSerialPortInfo = {
    portName: string
    vid: number
    pid: number
    manufacturer: string | null
    product: string | null
    serialNumber: string | null
}

type NativePortInfo = {
    port_name: string
    port_type: {
        UsbPort: {
            vid: number
            pid: number
            manufacturer: string | null
            product: string | null
            serial_number: string | null
        }
    }
}

const availablePorts = async (): Promise<UsbSerialPortInfo[]> => {
    const nativePortInfos = await invoke<NativePortInfo[]>('plugin:esp|available_ports')

    return nativePortInfos.map((nativePortInfo) => ({
        portName: nativePortInfo.port_name,
        vid: nativePortInfo.port_type.UsbPort.vid,
        pid: nativePortInfo.port_type.UsbPort.pid,
        manufacturer: nativePortInfo.port_type.UsbPort.manufacturer,
        product: nativePortInfo.port_type.UsbPort.product,
        serialNumber: nativePortInfo.port_type.UsbPort.serial_number,
    }))
}

const testConnection = async (portName: string): Promise<void> => {
    await invoke<void>('plugin:esp|test_connection', {
        portName,
    })
}

type EspflashStatus =
    | {
          type: 'Init'
          address: number
          total: number
      }
    | {
          type: 'Update'
          current: number
      }
    | {
          type: 'Finish'
      }

export type ProgressCallback = (percentage: number) => void

const flash = async (portName: string, progressCallback: ProgressCallback): Promise<void> => {
    let total = 0

    const portEventNameHexed = stringToHex(portName)
    const unlisten = await appWindow.listen<EspflashStatus>(
        `plugin-esp-flash-${portEventNameHexed}`,
        ({ payload }) => {
            switch (payload.type) {
                case 'Init': {
                    total = payload.total
                    break
                }

                case 'Update': {
                    if (total > 0) {
                        // In theory the total should always be set before the first Progress event,
                        // but we check this just for sanity.
                        progressCallback(Math.round((payload.current / total) * 100))
                    }
                    break
                }

                case 'Finish': {
                    progressCallback(100)
                    break
                }
            }
        },
    )

    try {
        await invoke<void>('plugin:esp|flash', {
            portName,
        })
    } finally {
        unlisten()
    }
}

type LogEvent =
    | {
          Data: string
      }
    | {
          Error: string
      }

const streamLogs = async (
    portName: string,
    callback: (logs: string) => void,
    errorCallback: (error: Error, hasOpenirisInstallation?: boolean) => void,
    signal?: AbortSignal,
): Promise<void> => {
    let buffer = ''

    const unlisten = await appWindow.listen<LogEvent>('plugin-esp-logs', ({ payload }) => {
        if ('Data' in payload) {
            buffer += payload.Data
            const lines = buffer.split('\r\n')
            buffer = lines.pop()!

            for (const line of lines) {
                callback(line)
            }
        } else {
            errorCallback(new Error(payload.Error))
        }
    })

    signal?.addEventListener('abort', () => {
        unlisten()
        void invoke<void>('plugin:esp|cancel_stream_logs', {
            portName,
        })
    })

    await invoke<void>('plugin:esp|stream_logs', {
        portName,
    })
}

export type SetWifiCommand = {
    command: 'set_wifi'
    data: {
        ssid: string
        password: string
    }
}

export type SetMdnsCommand = {
    command: 'set_mdns'
    data: {
        hostname: string
    }
}

export type Command = SetWifiCommand | SetMdnsCommand

const sendCommands = async (portName: string, commands: Command[]): Promise<void> => {
    await invoke<void>('plugin:esp|send_commands', {
        portName,
        commands,
    })
}

export const espApi = {
    availablePorts,
    testConnection,
    flash,
    streamLogs,
    sendCommands,
}
