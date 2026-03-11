import { NOTIFICATION_ACTION, NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import {
    NotificationAction,
    Notifications,
    setNotification,
} from '@store/notifications/notifications'
import { enableNotifications, globalNotificationsType } from '@store/notifications/selectors'
import { checkPermission } from './checkPermission'
import { handleSound } from './handleSound'

const mapNotificationCallback = (
    type: NOTIFICATION_ACTION,
    { callbackOS, callbackApp }: NotificationAction,
) => {
    /* eslint-disable */
    switch (type) {
        case NOTIFICATION_ACTION.OS:
            return callbackOS()
        case NOTIFICATION_ACTION.APP:
            return callbackApp()
    }
    /* eslint-enable */
}

export const addNotification = (notification: Notifications) => {
    if (!enableNotifications()) return
    checkPermission()
    const { message, type } = notification

    const toastMap: Record<NOTIFICATION_TYPE, (msg: string) => void> = {
        [NOTIFICATION_TYPE.ERROR]: (msg) => {
            setNotification({
                type: NOTIFICATION_TYPE.ERROR,
                message: msg,
                duration: 5000,
                id: Date.now(),
            })
        },
        [NOTIFICATION_TYPE.SUCCESS]: (msg) => {
            setNotification({
                type: NOTIFICATION_TYPE.SUCCESS,
                message: msg,
                duration: 5000,
                id: Date.now(),
            })
        },
        [NOTIFICATION_TYPE.INFO]: (msg) => {
            setNotification({
                type: NOTIFICATION_TYPE.INFO,
                message: msg,
                duration: 5000,
                id: Date.now(),
            })
        },
        [NOTIFICATION_TYPE.WARNING]: (msg) => {
            setNotification({
                type: NOTIFICATION_TYPE.WARNING,
                message: msg,
                duration: 5000,
                id: Date.now(),
            })
        },
        [NOTIFICATION_TYPE.DEFAULT]: (msg) => {
            setNotification({
                type: NOTIFICATION_TYPE.DEFAULT,
                message: msg,
                duration: 5000,
                id: Date.now(),
            })
        },
    }

    mapNotificationCallback(globalNotificationsType(), {
        callbackOS: () => {
            setNotification({
                type: NOTIFICATION_TYPE.DEFAULT,
                message: message,
                duration: 5000,
                id: Date.now(),
            })
        },
        callbackApp: () => {
            handleSound('EyeTrackApp_Audio_notif.mp3')
            toastMap[type ?? NOTIFICATION_TYPE.DEFAULT](message)
        },
    })
}
