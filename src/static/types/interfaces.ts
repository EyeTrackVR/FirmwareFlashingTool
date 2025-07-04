//* Utility Interfaces

import { RESTStatus, RESTType } from './enums'
import { CHANNEL_TYPE } from './ui/enums'
import { IDropdownList } from './ui/interface'
import { IActivePort } from './ui/types'

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
