export class LoggerApi {
    private data: string[] = []

    public _add(message: string): void {
        this.data.push(message)
    }

    private sectionStart(type: string, action: string): void {
        const label = action ? `${type} (${action}) START` : `${type} START`
        this._add('')
        this._add(`------------${label}------------`)
        this._add('')
    }

    private sectionEnd(type: string, action: string): void {
        const label = action ? `${type} (${action}) END` : `${type} END`
        this._add('')
        this._add(`------------${label}------------`)
        this._add('')
    }

    public _functionStart(action: string): void {
        this.sectionStart('LOG', action)
    }

    public _functionEnd(action: string): void {
        this.sectionEnd('LOG', action)
    }

    public _logStart(action: string): void {
        this.sectionStart('LOG', action)
    }

    public _logEnd(action: string): void {
        this.sectionEnd('LOG', action)
    }

    public _infoStart(action: string): void {
        this.sectionStart('INFO', action)
    }

    public _infoEnd(action: string): void {
        this.sectionEnd('INFO', action)
    }

    public _warnStart(action: string): void {
        this.sectionStart('WARNING', action)
    }

    public _warnEnd(action: string): void {
        this.sectionEnd('WARNING', action)
    }

    public _errorStart(action: string): void {
        this.sectionStart('ERROR', action)
    }

    public _errorEnd(action: string): void {
        this.sectionEnd('ERROR', action)
    }

    public _getLogs(): string {
        return this.data.join('\n')
    }
}
