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
