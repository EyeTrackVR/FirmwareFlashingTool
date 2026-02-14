import { describe, expect, it } from 'vitest'
import {
    CapitalizeFirstLetter,
    formatDeviceName,
    isEmpty,
    shortMdnsAddress,
    shortName,
    sleep,
    stringToHex,
    trimLogsByTextLength,
} from '.'

describe('utils', () => {
    it('capitalize first letter', () => {
        expect(CapitalizeFirstLetter('hello')).toBe('Hello')
    })

    it('is empty', () => {
        const arr: string[] = []
        expect(isEmpty(arr)).toBe(true)

        const nonEmpty = [1]
        expect(isEmpty(nonEmpty)).toBe(false)
    })

    it('handles long addresses', () => {
        const word = 'wordwordwordwordwordwordwordwordwordwordwordwordwordwordwordword'

        expect(shortMdnsAddress(word)).toBe('wordwordword...wordwordword')
    })

    it('sleep method', async () => {
        const start = Date.now()
        await sleep(100)
        const end = Date.now()

        expect(end - start).toBeGreaterThanOrEqual(100)
    })

    it('short name method', () => {
        const format = shortName('wordwordwordwordwordwordwordwordwordwordwordwordwordwordwordword')
        expect(format).toBe('wordwordword...wordwordword')
    })

    it('generate hex format', () => {
        const format = stringToHex('123')
        expect(format).toBe('313233')
    })
})

describe('formatDeviceName', () => {
    it('removes .zip', () => {
        expect(formatDeviceName('device-v1.0.zip')).toBe('device')
    })

    it('replaces - with _', () => {
        expect(formatDeviceName('my-device-v2.3.zip')).toBe('my_device')
    })

    it('handles names without version', () => {
        expect(formatDeviceName('simple-device.zip')).toBe('simple_device')
    })

    it('handles names without .zip', () => {
        expect(formatDeviceName('custom-device-v3.0')).toBe('custom_device')
    })
})

describe('trimLogsByTextLength', () => {
    it('returns empty array for empty string', () => {
        expect(trimLogsByTextLength('', 10)).toEqual([])
        expect(trimLogsByTextLength('   ', 10)).toEqual([])
    })

    it('returns original log if shorter than max length', () => {
        expect(trimLogsByTextLength('short log', 20)).toEqual(['short log'])
    })

    it('splits long log into chunks', () => {
        const log = 'Thisisalong logthatneeds tobesplitproperly'
        const result = trimLogsByTextLength(log, 10)
        expect(result.every((chunk) => chunk.length <= 10)).toBe(true)
    })

    it('handles logs with no spaces', () => {
        const log = 'abcdefghijk'
        const result = trimLogsByTextLength(log, 5)
        expect(result).toEqual(['abcde', 'fghij', 'k'])
    })
})
