import type { DebugMode } from '@static/types'
import type { JSXElement } from 'solid-js'
import {
    type CHANNEL_TYPE,
    type RESTStatus,
    type RESTType,
    FLASH_STATUS,
    FLASH_STEP,
} from './enums'

//* Utility Interfaces

//* Component Interfaces

export interface NotificationAction {
    callbackOS(): void
    callbackApp(): void
}

export interface IEndpoint {
    url: string
    type: RESTType
}

export interface IRest {
    status: RESTStatus
    device: string
    response: object
}

export interface IGHAsset {
    name: string
    browser_download_url: string
}

export interface IGHRest {
    status: RESTStatus
    assets: IGHAsset[]
    version: string
}

export interface IGHResponse {
    url: string
    status: number
    ok: boolean
    headers: Record<string, string>
    rawHeaders: Record<string, string[]>
    data: IGHRelease
}

export interface IGHRelease {
    data: object
    headers: object
    rawHeaders: object
    ok: boolean
    status: number
    url: string
    prerelease?: boolean
}

//*  App Store Interfaces  */

export interface AppStore {
    debugMode: DebugMode
}

export type IActivePort = {
    activePortName: string
    autoSelect: boolean
}

export interface AppStoreAPI {
    restAPI: IRest
    ghAPI: IGHRest
    firmwareType: string
    activeBoard: string
    ssid: string
    password: string
    apModeStatus: boolean
    mdns: string
    channelMode: CHANNEL_TYPE
    manifestPath: string
    activePort: IActivePort
    ports: IDropdownList[]
}

export interface ISignal {
    requestToSend: boolean
    dataTerminalReady: boolean
}

export interface IChannelOptions {
    label: CHANNEL_TYPE
    description: string
}

export interface IDropdownList {
    label: string | CHANNEL_TYPE
    description?: string
}

export interface IFlashState {
    status: FLASH_STATUS
    label: string
    errorName?: string
}

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
