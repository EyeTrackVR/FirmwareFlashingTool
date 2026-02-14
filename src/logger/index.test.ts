import { describe, it, expect } from 'vitest'
import { logger } from '.'

describe('Logger', () => {
    it('should return the logger instance', () => {
        expect(logger).toBeDefined()
    })
})

describe('LoggerCore', () => {
    it('should add a message to the logs', () => {
        logger.add('Hello World')
        const logs = logger.getLogs()

        expect(logs).toContain('Hello World')
    })

    it('should correctly log a start and end section for INFO', () => {
        logger.infoStart('Init')
        logger.infoEnd('Init')

        const logs = logger.getLogs()

        expect(logs).toContain('------------INFO (Init) START------------')
        expect(logs).toContain('------------INFO (Init) END------------')
    })
})

describe('loggerError', () => {
    it('expect error', () => {
        logger.clear()

        logger.errorStart('ERROR')
        logger.add('failed to connect')
        logger.errorEnd('ERROR')

        const logs = logger.getLogs()

        expect(logs).toContain('------------ERROR (ERROR) START------------')
        expect(logs).toContain('failed to connect')
        expect(logs).toContain('------------ERROR (ERROR) END------------')
    })
})
