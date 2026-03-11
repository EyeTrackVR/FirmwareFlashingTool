import { NOTIFICATION_ACTION, NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { IToast } from '@interfaces/notifications/interfaces'
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
    notifications: IToast[]
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: NOTIFICATION_ACTION
}

const defaultState: AppStoreNotifications = {
    notifications: [],
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

export const setNotification = (toast: IToast) => {
    const limit = 30
    setState(
        produce((s) => {
            if (s.notifications.length >= limit) s.notifications.pop()
            s.notifications = [toast, ...s.notifications]
        }),
    )
}

export const dismissNotification = (id: number) => {
    setState(
        produce((s) => {
            s.notifications = s.notifications.filter((t) => t.id !== id)
        }),
    )
}

export const notificationsState = () => state
