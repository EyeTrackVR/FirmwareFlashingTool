import { ENotificationAction, ENotificationType } from './enums'
import type { CHANNEL_TYPE, RESTStatus, RESTType } from '@src/static/types/enums'
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
}

export interface UiStore {
    openModal?: boolean
    showNotifications?: boolean
    menuOpen?: MenuOpen | null
    contextAnchor?: HTMLElement | null
}

interface SerialOutputSignals {
    dataTerminalReady?: boolean | undefined
    requestToSend?: boolean | undefined
    break?: boolean | undefined
}

export interface INavigatorPort extends Navigator {
    open: ({ baudRate }: { baudRate: number }) => Promise<void>
    setSignals(signals: SerialOutputSignals): Promise<void>
    close: () => Promise<void>
}

export interface INavigator extends Navigator {
    serial: {
        requestPort: () => INavigatorPort
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
