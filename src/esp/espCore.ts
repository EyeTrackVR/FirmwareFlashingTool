import { EspApiCore } from './espApiCore'
import * as Type from './interfaces/types'

export class EspApiClientProvider extends EspApiCore {
    public async getAvailableNetworks(port: string) {
        return this._getPossibleNetworks(port)
    }

    public async getDeviceMode(portName: string) {
        return this._getDeviceMode(portName)
    }

    public async validateConnection(portName: string) {
        return this._validateConnection(portName)
    }

    public async switchDeviceMode(port: string, deviceMode: Type.DeviceMode) {
        return this._switchDeviceMode(port, deviceMode)
    }

    public async getDeviceName(port: string) {
        return this._getDeviceName(port)
    }

    public async flash(portName: string, progressCallback: Type.ProgressCallback) {
        return this._flash(portName, progressCallback)
    }

    public async streamLogs(
        portName: string,
        callback: (logs: string) => void,
        errorCallback: (error: Error) => void,
        signal?: AbortSignal,
    ) {
        return this._streamLogs(portName, callback, errorCallback, signal)
    }

    public async setupWirelessConnection(
        port: string,
        mdns: string,
        ssid: string,
        password: string,
        channel: number,
    ) {
        return this._setupWirelessConnection(port, mdns, ssid, password, channel)
    }

    public async setupWiredConnection(mdns: string, port: string) {
        return this._setupWiredConnection(mdns, port)
    }

    public async checkPortConnection(currentUserActivePort: string) {
        return this._checkPortConnection(currentUserActivePort)
    }

    public async getAvailablePorts() {
        return this._getAvailablePorts()
    }
}
