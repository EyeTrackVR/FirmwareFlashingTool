import { ENotificationAction, ENotificationType } from '../enums'
import type { DebugMode } from '@static/types'
import type { RESTStatus, RESTType } from '@static/types/enums'
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

export interface IGHRelease {
    data: object
    headers: object
    rawHeaders: object
    ok: boolean
    status: number
    url: string
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
    ref: HTMLElement | null
    name: string
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
    restAPI: IRest
    ghAPI: IGHRest
    firmwareType: string
}

export interface UiStore {
    openModal?: boolean
    showNotifications?: boolean
}
