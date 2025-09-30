import { type CHANNEL_TYPE } from './enums'

export interface IChannelOptions {
    label: CHANNEL_TYPE
    description: string
}

export interface IDropdownList {
    label: string | CHANNEL_TYPE
    description?: string
}
