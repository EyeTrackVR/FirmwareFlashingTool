import { NOTIFICATION_ACTION, NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { NotificationAction, Notifications } from '@store/notifications/notifications'
import { enableNotifications, globalNotificationsType } from '@store/notifications/selectors'
import { toast } from 'solid-sonner'
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

    const toastOptions = {
        style: { background: '#0D1B26', color: '#fff', border: '1px solid #192736' },
        actionButtonStyle: {
            background: '#192736',
            border: '1px solid #192736',
            color: '#FFFFFF',
        },
        class: 'my-custom-toast',
        action: {
            label: 'X',
            onClick: () => console.log('Undo'),
        },
    }

    const toastMap: Record<NOTIFICATION_TYPE, (msg: string) => void> = {
        [NOTIFICATION_TYPE.ERROR]: (msg) => toast.error(msg, toastOptions),
        [NOTIFICATION_TYPE.SUCCESS]: (msg) => toast.success(msg, toastOptions),
        [NOTIFICATION_TYPE.INFO]: (msg) => toast.info(msg, toastOptions),
        [NOTIFICATION_TYPE.WARNING]: (msg) => toast.warning(msg, toastOptions),
        [NOTIFICATION_TYPE.DEFAULT]: (msg) => toast(msg, toastOptions),
    }

    mapNotificationCallback(globalNotificationsType(), {
        callbackOS: () => {
            toast(message, {
                action: {
                    label: 'Close',
                    onClick: () => console.log('Undo'),
                },
            })
        },
        callbackApp: () => {
            handleSound('EyeTrackApp_Audio_notif.mp3')
            toastMap[type ?? NOTIFICATION_TYPE.DEFAULT](message)
        },
    })
}
