import { createStore, produce } from 'solid-js/store'
import { ToasterStore } from 'solid-headless'
import { ENotificationAction, ENotificationType } from '@interfaces/enums'
import { createMemo } from 'solid-js'

export interface INotifications {
    title: string
    message: string
    type: ENotificationType
}

export interface IAppStoreNotifications {
    notifications: ToasterStore<INotifications>
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: ENotificationAction
}

const defaultState: IAppStoreNotifications = {
    notifications: new ToasterStore<INotifications>(),
    enableNotificationsSounds: true,
    enableNotifications: true,
    globalNotificationsType: ENotificationAction.APP,
}

const [state, setState] = createStore<IAppStoreNotifications>(defaultState)

export const setEnableNotificationsSounds = (flag: boolean | undefined) => {
    setState(
        produce((s) => {
            s.enableNotificationsSounds = flag || false
        }),
    )
}

export const setEnableNotifications = (flag: boolean | undefined) => {
    setState(
        produce((s) => {
            s.enableNotifications = flag || false
        }),
    )
}

export const setGlobalNotificationsType = (type: ENotificationAction) => {
    setState(
        produce((s) => {
            s.globalNotificationsType = type
        }),
    )
}

export const notificationsState = createMemo(() => state)
