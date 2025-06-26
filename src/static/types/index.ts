export * as O from 'fp-ts/Option'
import type { ENotificationAction } from './enums'
import type { JSXElement } from 'solid-js'
import { type ITracker } from './trackers/interfaces'
import { TRACKER_POSITION } from './trackers/enums'

//********************************* Utility *************************************/
export type Context = {
    [key: string]: JSXElement
}

//********************************* Settings *************************************/

//********************************* Config *************************************/

/**
 * @description This is the export type that is passed to the Tauri Store instance to handle persistent data within the app.
 * @export typedef {Object} PersistentSettings
 * @property {boolean} enableNotificationsSounds
 * @property {boolean} enableNotifications
 * @property {ENotificationAction} globalNotificationsType
 * @property {boolean} enableMDNS
 * @property {boolean} scanForCamerasOnStartup
 * @property {CameraSettings} cameraSettings
 * @property {AlgorithmSettings} algorithmSettings
 * @property {FilterParams} filterParams
 * @property {OSCSettings} oscSettings
 */
export type PersistentSettings = {
    user?: string
    enableNotificationsSounds?: boolean
    enableNotifications?: boolean
    globalNotificationsType?: ENotificationAction
    trackers?: ITracker[]
    rotation?: Record<TRACKER_POSITION, number>
    algorithmOrder?: Record<TRACKER_POSITION, string[]>
}
