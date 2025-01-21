import { defaultMdnsLength, mdnsLength } from '@src/static'

export const CapitalizeFirstLetter = (letter: string) => {
    return letter.charAt(0).toUpperCase() + letter.slice(1)
}

export const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(' ')
}

export const isEmpty = <T>(obj: object | Array<T>) => {
    if (!Array.isArray(obj)) {
        // ⇒ do not attempt to process array
        return Object.keys(obj).length === 0
    }
    return !obj.length
}

export const shortMdnsAddress = (text: string) => {
    if (text.length < defaultMdnsLength) return text
    const firstHalf = text.slice(0, mdnsLength)
    const secondHalf = text.slice(text.length - mdnsLength, text.length)
    return `${firstHalf}...${secondHalf}`
}

export const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
export const download = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/plain' })
    const anchor = document.createElement('a')

    anchor.download = filename
    anchor.href = window.URL.createObjectURL(blob)
    anchor.target = '_blank'
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
}

export const trimLogsByTextLength = (logs: string, maxLength: number): string[] => {
    if (!logs.trim().length) return []
    if (logs.length <= maxLength) return [logs]

    const validLogs: string[] = []
    let buffer = ''
    let start = 0

    while (start < logs.length) {
        const end = Math.min(start + maxLength, logs.length)

        let lastSpaceIndex = logs.lastIndexOf(' ', end)
        if (lastSpaceIndex === -1 || lastSpaceIndex < start) {
            lastSpaceIndex = end
        }

        const substring = logs.slice(start, lastSpaceIndex)

        buffer += substring.trim()

        if (buffer.length >= maxLength) {
            validLogs.push(buffer)
            buffer = ''
        } else {
            buffer += ' '
        }

        start = lastSpaceIndex + 1
    }

    if (buffer.trim().length > 0) {
        validLogs.push(buffer.trim())
    }

    return validLogs
}

export const shortName = (label: string, size: number = 12): string => {
    if (label.length <= size * 2) return label
    return `${label.slice(0, size)}...${label.slice(-size)}`
}

export const stringToHex = (str: string) => {
    let hex = ''
    for (let i = 0; i < str.length; i++) {
        // Convert each character to its UTF-16 code unit and then to hex
        hex += str.charCodeAt(i).toString(16).padStart(2, '0') // pad to 2 digits
    }
    return hex
}
