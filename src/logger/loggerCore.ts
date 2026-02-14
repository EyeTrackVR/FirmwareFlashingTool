import { LoggerApi } from './loggerApi'

export class LoggerCore extends LoggerApi {
    public getLogs() {
        return this._getLogs()
    }

    public clear() {
        this._clear()
    }

    public add(message: string) {
        this._add(message)
    }

    public functionStart(action: string) {
        this._functionStart(action)
    }

    public functionEnd(action: string) {
        this._functionEnd(action)
    }

    public logStart(action?: string) {
        this._logStart(action ?? '')
    }

    public logEnd(action?: string) {
        this._logEnd(action ?? '')
    }

    public infoStart(action?: string) {
        this._infoStart(action ?? '')
    }

    public infoEnd(action?: string) {
        this._infoEnd(action ?? '')
    }

    public warnStart(action?: string) {
        this._warnStart(action ?? '')
    }

    public warnEnd(action?: string) {
        this._warnEnd(action ?? '')
    }

    public errorStart(action?: string) {
        this._errorStart(action ?? '')
    }

    public errorEnd(action?: string) {
        this._errorEnd(action ?? '')
    }
}
