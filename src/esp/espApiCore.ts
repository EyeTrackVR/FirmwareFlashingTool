import { sleep, stringToHex } from '@src/utils'
import { INetwork } from '@store/network/network'
import { invoke, InvokeArgs } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { COMMAND, ESP_COMMAND } from './commands'
import * as Type from './interfaces/types'
import { apiTextParser, parseMultiJSON } from './utils'

export class EspApiCore {
    AUTH_MODE: Record<number, string> = {
        0: 'Open',
        1: 'WEP',
        2: 'WPA PSK',
        3: 'WPA2 PSK',
        4: 'WPA WPA2 PSK',
        5: 'WPA2 Enterprise',
        6: 'WPA3 PSK',
        7: 'WPA2 WPA3 PSK',
    }

    public async sendCommand<T>(
        command: string,
        data: InvokeArgs | undefined = undefined,
    ): Promise<T> {
        if (data) {
            return (await invoke(command, data)) as T
        }
        return (await invoke(command)) as T
    }

    public async _sendCommands<T>(data: InvokeArgs): Promise<T> {
        return (await invoke(ESP_COMMAND.SEND_COMMANDS, data)) as T
    }

    public async _validateConnection(portName: string) {
        await this.sendCommand<string>(ESP_COMMAND.TEST_CONNECTION, { portName })
    }

    public async _setMdnsName(portName: string, mdns: string) {
        await this._sendCommands({
            commands: [{ command: COMMAND.SET_MDNS, data: { hostname: mdns } }],
            portName,
        })
    }

    public async _pause(portName: string) {
        await this._sendCommands<string>({
            portName,
            commands: [{ command: COMMAND.PAUSE, data: { pause: true } }],
        })
    }

    public async _checkPortConnection(currentUserActivePort: string) {
        await sleep(2000)
        const CHECK_INTERVAL = 250
        const TIMEOUT = 5000
        const maxChecks = Math.ceil(TIMEOUT / CHECK_INTERVAL)
        let checks = 0

        return new Promise((resolve) => {
            const interval = setInterval(async () => {
                checks++

                try {
                    const ports = await this._getAvailablePorts()

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

    public async _getPossibleNetworks(port: string): Promise<INetwork[]> {
        await invoke(ESP_COMMAND.GET_WIFI_CONNECTION_STATUS, {
            commands: [{ command: COMMAND.GET_WIFI_STATUS }],
            portName: port,
        })

        const response: string = await invoke(ESP_COMMAND.GET_POSSIBLE_NETWORKS, {
            commands: [{ command: COMMAND.SCAN_NETWORKS }],
            portName: port,
        })

        return response
            .split('\n')
            .filter((el) => el.match('networks'))
            .map((el) => JSON.parse(el)?.networks ?? [])
            .flat()
            .map((network) => ({
                ...network,
                auth_mode: this.AUTH_MODE[network.auth_mode] ?? network.auth_mode,
            }))
    }

    public async _getDeviceMode(portName: string) {
        const response = await this._sendCommands<string>({
            commands: [{ command: COMMAND.GET_DEVICE_MODE }],
            portName,
        })

        const mode = parseMultiJSON(response)
            .find((obj) => obj.results)
            ?.results?.map((el) => apiTextParser<{ mode: string }>(el))[0]?.mode

        if (!mode) {
            throw new Error('Failed to get device mode')
        }

        return mode
    }

    async _getDeviceName(portName: string) {
        const response = await this._sendCommands<string>({
            commands: [{ command: COMMAND.GET_MDNS_NAME }],
            portName,
        })

        const parsedResponse: { results: Array<string> } = JSON.parse(response)
        return parsedResponse.results.map((res) => apiTextParser<{ hostname: string }>(res))[0]
            .hostname
    }

    async _getAvailablePorts() {
        const nativePortInfos = await this.sendCommand<Type.NativePortInfo[]>(
            ESP_COMMAND.GET_AVAILABLE_NETWORKS,
        )

        return nativePortInfos.map((nativePortInfo) => ({
            portName: nativePortInfo.port_name,
            vid: nativePortInfo.port_type.UsbPort.vid,
            pid: nativePortInfo.port_type.UsbPort.pid,
            manufacturer: nativePortInfo.port_type.UsbPort.manufacturer,
            product: nativePortInfo.port_type.UsbPort.product,
            serialNumber: nativePortInfo.port_type.UsbPort.serial_number,
        }))
    }

    public async _switchDeviceMode(port: string, deviceMode: Type.DeviceMode) {
        let switchModeTries = 5

        const updateDeviceModePromise = new Promise(async (resolve, reject) => {
            while (switchModeTries > 0) {
                try {
                    const currentDeviceMode = await this._getDeviceMode(port)

                    const isValidBefore =
                        JSON.stringify(currentDeviceMode.toLocaleLowerCase()) ===
                        JSON.stringify(deviceMode)

                    if (isValidBefore) {
                        resolve('')
                        return
                    }

                    await this._sendCommands({
                        commands: [{ command: COMMAND.SWITCH_MODE, data: { mode: deviceMode } }],
                        portName: port,
                    })

                    await sleep(200)

                    const updatedDeviceMode = await this._getDeviceMode(port)

                    const isValidAfter =
                        JSON.stringify(updatedDeviceMode.toLocaleLowerCase()) ===
                        JSON.stringify(deviceMode)

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

        await this._sendCommands({
            commands: [{ command: COMMAND.RESTART_DEVICE }],
            portName: port,
        })

        await sleep(2000)
    }

    public async _switchDeviceName(port: string, mdns: string) {
        let tries = 5
        const promise = new Promise(async (resolve, reject) => {
            while (tries > 0) {
                try {
                    const currentHostname = await this._getDeviceName(port)

                    if (JSON.stringify(currentHostname) === JSON.stringify(mdns)) {
                        resolve('')
                        return
                    }

                    await this._setMdnsName(port, mdns)
                    await sleep(200)

                    const updatedHostName = await this._getDeviceName(port)

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
    }

    public async _flash(portName: string, progressCallback: Type.ProgressCallback): Promise<void> {
        let total = 0

        const portEventNameHexed = stringToHex(portName)
        const unlisten = await appWindow.listen<Type.EspflashStatus>(
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
            await invoke<void>(ESP_COMMAND.FLASH, {
                portName,
            })
        } finally {
            unlisten()
        }
    }

    public async _streamLogs(
        portName: string,
        callback: (logs: string) => void,
        errorCallback: (error: Error) => void,
        signal?: AbortSignal,
    ): Promise<void> {
        let buffer = ''

        const unlisten = await appWindow.listen<Type.LogEvent>(
            ESP_COMMAND.GET_LOGS,
            ({ payload }) => {
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
            },
        )

        signal?.addEventListener('abort', () => {
            unlisten()
            void invoke<void>(ESP_COMMAND.CANCEL_STREAM_LOGS, {
                portName,
            })
        })

        await invoke<void>(ESP_COMMAND.STREAM_LOGS, { portName })
    }

    // TODO temporary solution
    public async _setupWirelessConnection(
        port: string,
        mdns: string,
        ssid: string,
        password: string,
        channel: number,
    ) {
        await this._switchDeviceMode(port, 'wifi')

        const commands = [
            { command: COMMAND.SET_MDNS, data: { hostname: mdns } },
            {
                command: COMMAND.SET_WIFI,
                data: { name: 'main', ssid, password, channel, power: 0 },
            },
        ]

        await this._sendCommands({ portName: port, commands })
        await this._sendCommands({ portName: port, commands: [{ command: COMMAND.CONNECT_WIFI }] })

        const response: string = await invoke(ESP_COMMAND.GET_WIFI_CONNECTION_STATUS, {
            commands: [{ command: COMMAND.GET_WIFI_STATUS }],
            portName: port,
        })

        const data = response
            .split('\n')
            .filter((el) => el.match('results'))
            .map((el) => el)

        const connectionStatus = data
            .filter((el) => el.match('results'))
            .map((el) => {
                const response = el.split('\n')[0].split(':')

                const isConnected = response.includes('connected')
                const isError = response.includes('disconnected')

                if (isConnected) return true
                if (isError) return false

                return undefined
            })
            .filter((el) => !!el)
            .every((el) => el)

        if (!connectionStatus) throw new Error('Failed to setup wireless connection')
    }

    public async _setupWiredConnection(mdns: string, port: string) {
        await this._switchDeviceName(port, mdns)
        await this._switchDeviceMode(port, 'uvc')
    }
}
