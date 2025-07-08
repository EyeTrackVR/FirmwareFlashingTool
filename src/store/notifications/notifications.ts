import { createStore, produce } from 'solid-js/store'
import { ToasterStore } from 'solid-headless'
import { createMemo } from 'solid-js'
import { NOTIFICATION_ACTION, NOTIFICATION_TYPE } from '@interfaces/ui/enums'

export interface INotifications {
    title: string
    message: string
    type: NOTIFICATION_TYPE
}

export interface IAppStoreNotifications {
    notifications: ToasterStore<INotifications>
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: NOTIFICATION_ACTION
}

const defaultState: IAppStoreNotifications = {
    notifications: new ToasterStore<INotifications>(),
    enableNotificationsSounds: true,
    enableNotifications: true,
    globalNotificationsType: NOTIFICATION_ACTION.APP,
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

export const setGlobalNotificationsType = (type: NOTIFICATION_ACTION) => {
    setState(
        produce((s) => {
            s.globalNotificationsType = type
        }),
    )
}

export const notificationsState = createMemo(() => state)
