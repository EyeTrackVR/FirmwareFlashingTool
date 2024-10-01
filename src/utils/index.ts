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

export const shortAddress = (text: string, size = 24) => {
    if (text.length <= size * 2) return text

    const start = text.slice(0, size)
    const end = text.slice(-size)

    return `${start}...${end}`
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

export const checkSystem = () => {
    //@ts-expect-error userAgentData can be undefined
    const platform = window.navigator?.userAgentData?.platform || window.navigator.platform
    const systems = {
        macOS: ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        Windows: ['Win32', 'Win64', 'Windows', 'WinCE'],
    }

    for (const [os, platforms] of Object.entries(systems)) {
        if (platforms.includes(platform)) {
            return os
        }
    }

    if (/Linux/.test(platform)) {
        return 'Linux'
    }

    return ''
}
