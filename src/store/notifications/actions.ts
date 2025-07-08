import { NotificationAction } from '@interfaces/interfaces'
import { NOTIFICATION_ACTION } from '@interfaces/ui/enums'
import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from '@tauri-apps/api/notification'
import { INotifications, setEnableNotifications } from './notifications'
import { enableNotificationsSounds, globalNotificationsType, notifications } from './selectors'

export const handleSound = async (
    soundfile_mp: string,
    soundfile_ogg?: string,
    soundfile_ma?: string,
) => {
    if (!enableNotificationsSounds()) return
    if (!soundfile_ogg) soundfile_ogg = soundfile_mp
    if (!soundfile_ma) soundfile_ma = soundfile_mp
    if ('Audio' in window) {
        const a = new Audio()
        if (a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))
            a.src = ('audio/' + soundfile_ogg) as string
        else if (a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))
            a.src = ('audio/' + soundfile_mp) as string
        else if (a.canPlayType && a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''))
            a.src = ('audio/' + soundfile_ma) as string
        else a.src = ('audio/' + soundfile_mp) as string

        a.play()
        return
    }
}

export const mapNotificationCallback = (
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

const checkPermission = async () => {
    let permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
        const permission = await requestPermission()
        permissionGranted = permission === 'granted'
    }
    setEnableNotifications(permissionGranted)
}

export const addNotification = (notification: INotifications) => {
    if (!enableNotificationsSounds()) return
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
