import { CHANNEL_TYPE } from './enums'

export const isValidChannel = (value: string): value is CHANNEL_TYPE => {
    return Object.values(CHANNEL_TYPE).includes(value as CHANNEL_TYPE)
}
