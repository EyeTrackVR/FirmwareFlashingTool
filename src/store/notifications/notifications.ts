import { NOTIFICATION_ACTION, NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { ToasterStore } from 'solid-headless'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface NotificationAction {
    callbackOS(): void
    callbackApp(): void
}

export interface Notifications {
    title: string
    message: string
    type: NOTIFICATION_TYPE
}

export interface AppStoreNotifications {
    notifications: ToasterStore<Notifications>
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: NOTIFICATION_ACTION
}

const defaultState: AppStoreNotifications = {
    notifications: new ToasterStore<Notifications>(),
    enableNotificationsSounds: true,
    enableNotifications: true,
    globalNotificationsType: NOTIFICATION_ACTION.APP,
}

const [state, setState] = createStore<AppStoreNotifications>(defaultState)

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

export const setGlobalNotificationsType = (type: NOTIFICATION_ACTION) => {
    setState(
        produce((s) => {
            s.globalNotificationsType = type
        }),
    )
}

export const notificationsState = createMemo(() => state)
