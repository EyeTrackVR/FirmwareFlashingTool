import { CHANNEL_TYPE, FLASH_STATUS, FLASH_STEP } from './enums'

export interface IFirmwareState {
    errorName?: string
    step: FLASH_STEP
    status: FLASH_STATUS
    label: string
}

export interface IStepStatus {
    description: string
    dashoffset: string
    index: string
}
export interface IFlashState {
    status: FLASH_STATUS
    label: string
    errorName?: string
}

export interface IDropdownList {
    label: string | CHANNEL_TYPE
    description?: string
}

export interface IChannelOptions {
    label: CHANNEL_TYPE
    description: string
}
