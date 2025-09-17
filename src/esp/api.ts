import { sleep, stringToHex } from '@src/utils'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { apiTextParser } from './utils'

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

export type switchMode = {
    command: 'switch_mode'
    data: {
        mode: 'uvc' | 'wifi' | 'auto'
    }
}

export type getMdnsName = {
    command: 'get_mdns_name'
}

export type getDeviceMode = {
    command: 'get_device_mode'
}

export type ScanNetworks = {
    command: 'scan_networks'
}

export type Pause = {
    command: 'pause'
    data: {
        pause: boolean
    }
}

export type Command =
    | SetWifiCommand
    | SetMdnsCommand
    | getMdnsName
    | getDeviceMode
    | switchMode
    | ScanNetworks
    | Pause

const sendCommands = async (portName: string, commands: Command[]): Promise<any> => {
    return await invoke('plugin:esp|send_commands', {
        portName,
        commands,
    })
}

export const validateUserPortConnection = async (
    currentUserActivePort: string,
): Promise<boolean> => {
    await sleep(2000)
    const CHECK_INTERVAL = 250
    const TIMEOUT = 5000
    const maxChecks = Math.ceil(TIMEOUT / CHECK_INTERVAL)
    let checks = 0

    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            checks++

            try {
                const ports = await availablePorts()
                const found = ports.some((port) => port.portName === currentUserActivePort)

                if (found) {
                    clearInterval(interval)
                    resolve(true)
                }
            } catch (err) {
                console.error('Error while validating port connection', err)
            }

            if (checks >= maxChecks) {
                clearInterval(interval)
                resolve(false)
            }
        }, CHECK_INTERVAL)
    })
}

export const getAvailableNetworks = async (port: string) => {
    await sendCommands(port, [{ command: 'pause', data: { pause: true } }])

    const response: string = await invoke('plugin:esp|get_possible_networks', {
        portName: port,
        commands: [{ command: 'scan_networks' }],
    })

    return response
        .split('\n')
        .filter((el) => el.match('networks'))
        .map((el) => JSON.parse(el)?.networks ?? [])
        .flat()
}

export const getDeviceName = async (port: string) => {
    const response = await sendCommands(port, [{ command: 'get_mdns_name' }])
    const parsedResponse: { results: Array<string> } = JSON.parse(response)

    return parsedResponse.results.map((res) => apiTextParser<{ hostname: string }>(res))[0].hostname
}

export const getDeviceMode = async (port: string) => {
    const response = await sendCommands(port, [{ command: 'get_device_mode' }])
    const parsedResponse: { results: Array<string> } = JSON.parse(response)

    return parsedResponse.results.map((res) => apiTextParser<{ mode: string }>(res))[0].mode
}

export const switchDeviceMode = async (port: string, mode: 'uvc' | 'wifi' | 'auto') => {
    await sendCommands(port, [{ command: 'switch_mode', data: { mode } }])
}

export const setupWiredConnection = async (mdns: string, port: string) => {
    let tries = 5

    const promise = new Promise(async (resolve, reject) => {
        while (tries > 0) {
            try {
                const currentHostname = await getDeviceName(port)

                if (JSON.stringify(currentHostname) === JSON.stringify(mdns)) {
                    resolve('')
                    return
                }

                await sendCommands(port, [{ command: 'set_mdns', data: { hostname: mdns } }])
                await sleep(200)

                const updatedHostName = await getDeviceName(port)

                if (JSON.stringify(updatedHostName) === JSON.stringify(mdns)) {
                    resolve('')
                    return
                }
            } catch (err) {
                if (tries === 1) {
                    if (err instanceof Error) {
                        reject(`'Failed to switch device mode': ${err.message}`)
                    }
                    reject(`'Failed to switch device mode': ${err}`)
                    return
                }
            }

            tries--
            await sleep(200)
        }
        reject('Failed to setup wired connection')
    })

    await promise

    const wiredMode = 'uvc'
    let switchModeTries = 5

    const updateDeviceModePromise = new Promise(async (resolve, reject) => {
        while (switchModeTries > 0) {
            try {
                const currentDeviceMode = await getDeviceMode(port)
                const isValidBefore =
                    JSON.stringify(currentDeviceMode.toLocaleLowerCase()) ===
                    JSON.stringify(wiredMode)

                if (isValidBefore) {
                    resolve('')
                    return
                }

                await switchDeviceMode(port, wiredMode)
                await sleep(200)

                const updatedDeviceMode = await getDeviceMode(port)

                const isValidAfter =
                    JSON.stringify(updatedDeviceMode.toLocaleLowerCase()) ===
                    JSON.stringify(wiredMode)

                if (isValidAfter) {
                    resolve('')
                    return
                }
            } catch (err) {
                if (switchModeTries === 1) {
                    if (err instanceof Error) {
                        reject(`'Failed to switch device mode': ${err.message}`)
                    }
                    reject(`'Failed to switch device mode': ${err}`)
                    return
                }
            }

            switchModeTries--
            await sleep(200)
        }

        reject('Failed to switch device mode')
    })

    await updateDeviceModePromise
}

export const espApi = {
    validateUserPortConnection,
    getDeviceMode,
    getDeviceName,
    setupWiredConnection,
    getAvailableNetworks,
    availablePorts,
    testConnection,
    flash,
    streamLogs,
    sendCommands,
}
