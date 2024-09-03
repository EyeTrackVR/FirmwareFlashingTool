import {
    type CHANNEL_TYPE,
    type RESTStatus,
    type RESTType,
    type MODAL_TYPE,
    ENotificationAction,
    ENotificationType,
    FLASH_STATUS,
    FLASH_STEP,
} from './enums'
import type { DebugMode } from '@static/types'
import type { WebviewWindow } from '@tauri-apps/api/window'
import type { ToasterStore } from 'solid-headless'
import type { JSXElement } from 'solid-js'

//* Utility Interfaces

export interface ETVRError {
    readonly _tag: 'ETVRError'
    readonly error: string | number | unknown
}

//* Component Interfaces
export interface Internal {
    errorMsg?: string
    error?: boolean
}

export interface Inputs {
    input: (props?: Internal) => JSXElement
}

export interface SkeletonHandlerProps {
    render?: boolean
    items?: SkeletonProps[]
    children?: JSXElement
}

export interface SkeletonProps {
    class: string
}

export interface CardProps {
    children?: JSXElement
    src?: string
    title?: string
    subTitle?: string
    imageAlt?: string
    buttonElement?: JSXElement
    background?: string
    backgroundColor?: string
}

export interface NotificationAction {
    callbackOS(): void
    callbackApp(): void
}

export interface Notifications {
    title: string
    message: string
    type: ENotificationType
}

export interface IWindow {
    label: string
    window: WebviewWindow
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

export interface IRestProps {
    endpointName: string
    deviceName: string
    args?: string
}

export interface MenuOpen {
    x: number
    y: number
}

export interface NewMenu {
    children: JSXElement
    id: string
}

export interface ModalMenu {
    children: JSXElement
    title?: string
    initialFocus?: string
}

//*  App Store Interfaces  */

export interface AppStore {
    debugMode: DebugMode
}

export interface AppStoreNotifications {
    notifications?: ToasterStore<Notifications>
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: ENotificationAction
}

export interface AppStoreAPI {
    loader: boolean
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
}

export interface IOpenModal {
    board?: string
    open: boolean
    type: MODAL_TYPE
}

export interface UiStore {
    openModal: IOpenModal
    showNotifications?: boolean
    menuOpen?: MenuOpen | null
    contextAnchor?: HTMLElement | null
    hideModal: boolean
}

export interface ISignal {
    requestToSend: boolean
    dataTerminalReady: boolean
}

export interface INavigatorPort extends Navigator {
    readable: {
        locked: boolean
        pipeThrough: (
            data: TextDecoderStream,
            object?: unknown,
        ) => {
            pipeThrough: (
                data: TransformStream,
                object?: unknown,
            ) => {
                pipeTo: (data: WritableStream, object?: unknown) => Promise<void>
            }
        }
    }
    setSignals: ({ requestToSend, dataTerminalReady }: ISignal) => Promise<void>
    open: ({ baudRate }: { baudRate: number }) => Promise<void>
    close: () => Promise<void>
}

export interface INavigator extends Navigator {
    serial: {
        requestPort: () => Promise<INavigatorPort>
    }
}

export interface IChannelOptions {
    label: CHANNEL_TYPE
    description: string
}

export interface IDropdownList {
    label: string | CHANNEL_TYPE
    description?: string
}

export interface Build {
    chipFamily: 'ESP32' | 'ESP8266' | 'ESP32-S2' | 'ESP32-S3' | 'ESP32-C3'
    parts: {
        path: string
        offset: number
    }[]
}

export interface Manifest {
    new_install_improv_wait_time?: number
    new_install_prompt_erase?: boolean
    home_assistant_domain?: string
    funding_url?: string
    builds: Build[]
    version: string
    name: string
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
