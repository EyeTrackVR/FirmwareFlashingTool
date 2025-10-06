import { NOTIFICATION_ACTION } from '@interfaces/notifications/enums'
import { NotificationAction, Notifications } from '@store/notifications/notifications'
import {
    enableNotifications,
    globalNotificationsType,
    notifications,
} from '@store/notifications/selectors'
import { sendNotification } from '@tauri-apps/api/notification'
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
    const { title, message } = notification

    mapNotificationCallback(globalNotificationsType(), {
        callbackOS: () => {
            sendNotification({
                title,
                body: message,
            })
        },
        callbackApp: () => {
            handleSound('EyeTrackApp_Audio_notif.mp3')
            notifications?.()?.create(notification)
        },
    })
}
