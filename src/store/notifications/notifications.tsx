import {
    sendNotification,
    isPermissionGranted,
    requestPermission,
} from '@tauri-apps/api/notification'
import { ToasterStore } from 'solid-headless'
import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type {
    Notifications,
    NotificationAction,
    AppStoreNotifications,
} from '@src/static/types/interfaces'
import type { Context } from '@static/types'
import { ENotificationAction } from '@src/static/types/enums'

interface AppNotificationsContext {
    getEnableNotificationsSounds: Accessor<boolean>
    getEnableNotifications: Accessor<boolean>
    getGlobalNotificationsType: Accessor<ENotificationAction>
    getNotifications: Accessor<ToasterStore<Notifications> | undefined>
    setEnableNotifications: (flag: boolean | undefined) => void
    setEnableNotificationsSounds: (flag: boolean | undefined) => void
    setGlobalNotificationsType: (type: ENotificationAction) => void
    handleSound: (soundfile_mp: string, soundfile_ogg?: string, soundfile_ma?: string) => void
    notify: (title: string, body: string | undefined) => void
    addNotification: (notification: Notifications) => void
    checkPermission: () => Promise<void>
}

const AppNotificationsContext = createContext<AppNotificationsContext>()
export const AppNotificationProvider: Component<Context> = (props) => {
    const defaultState: AppStoreNotifications = {
        notifications: new ToasterStore<Notifications>(),
        enableNotificationsSounds: true,
        enableNotifications: true,
        globalNotificationsType: ENotificationAction.APP,
    }

    const [state, setState] = createStore<AppStoreNotifications>(defaultState)

    const setEnableNotificationsSounds = (flag: boolean | undefined) => {
        setState(
            produce((s) => {
                s.enableNotificationsSounds = flag || false
            }),
        )
    }

    const setEnableNotifications = (flag: boolean | undefined) => {
        setState(
            produce((s) => {
                s.enableNotifications = flag || false
            }),
        )
    }

    const setGlobalNotificationsType = (type: ENotificationAction) => {
        setState(
            produce((s) => {
                s.globalNotificationsType = type
            }),
        )
    }

    const handleSound = async (
        soundfile_mp: string,
        soundfile_ogg?: string,
        soundfile_ma?: string,
    ) => {
        if (!getEnableNotificationsSounds()) return
        if (!soundfile_ogg) soundfile_ogg = soundfile_mp
        if (!soundfile_ma) soundfile_ma = soundfile_mp
        if ('Audio' in window) {
            const a = new Audio()
            if (a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))
                a.src = ('audio/' + soundfile_ogg) as string
            else if (a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))
                a.src = ('audio/' + soundfile_mp) as string
            else if (
                a.canPlayType &&
                a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, '')
            )
                a.src = ('audio/' + soundfile_ma) as string
            else a.src = ('audio/' + soundfile_mp) as string

            a.play()
            return
        }
    }

    /**
     * Send notification to the WebView Window using the browser API
     * @param {string} title Title of the notification
     * @param {string | undefined} body Body of the notification
     */
    const notify = (title: string, body: string | undefined) => {
        new Notification(title, { body: body || '' })
    }

    const mapNotificationCallback = (
        type: ENotificationAction,
        { callbackOS, callbackApp }: NotificationAction,
    ) => {
        /* eslint-disable */
        switch (type) {
            case ENotificationAction.OS:
                return callbackOS()
            case ENotificationAction.APP:
                return callbackApp()
        }
        /* eslint-enable */
    }

    /**
     * Send notification to the OS or to the WebView Window using a custom API
     * @param {Notifications} notification Notification message
     */
    const addNotification = (notification: Notifications) => {
        if (!getEnableNotifications()) return
        checkPermission()
        const { title, message } = notification
        mapNotificationCallback(getGlobalNotificationsType(), {
            callbackOS: () => {
                sendNotification({
                    title,
                    body: message,
                })
            },
            callbackApp: () => {
                handleSound('EyeTrackApp_Audio_notif.mp3')
                getNotifications()?.create(notification)
            },
        })
    }

    const checkPermission = async () => {
        let permissionGranted = await isPermissionGranted()
        if (!permissionGranted) {
            const permission = await requestPermission()
            permissionGranted = permission === 'granted'
        }
        setEnableNotifications(permissionGranted)
    }

    const notificationState = createMemo(() => state)

    const getEnableNotificationsSounds = createMemo(
        () => notificationState().enableNotificationsSounds,
    )
    const getGlobalNotificationsType = createMemo(() => notificationState().globalNotificationsType)
    const getEnableNotifications = createMemo(() => notificationState().enableNotifications)
    const getNotifications = createMemo(() => notificationState().notifications)

    return (
        <AppNotificationsContext.Provider
            value={{
                getEnableNotificationsSounds,
                getEnableNotifications,
                getGlobalNotificationsType,
                getNotifications,
                setEnableNotifications,
                setEnableNotificationsSounds,
                setGlobalNotificationsType,
                handleSound,
                notify,
                addNotification,
                checkPermission,
            }}>
            {props.children}
        </AppNotificationsContext.Provider>
    )
}

export const useAppNotificationsContext = () => {
    const context = useContext(AppNotificationsContext)
    if (context === undefined) {
        throw new Error('useAppNotificationsContext must be used within an AppNotificationProvider')
    }
    return context
}
