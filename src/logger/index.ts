import { LoggerCore } from './loggerCore'

let _logger: LoggerCore | undefined

const getLogger = (): LoggerCore => {
    _logger = new LoggerCore()
    return _logger
}

export const logger = getLogger()
