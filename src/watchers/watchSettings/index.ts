import { PersistentSettings } from '@interfaces/settings/interfaces'
import { usePersistentStore } from '@src/persistenStore'
import {
    enableNotifications,
    enableNotificationsSounds,
    globalNotificationsType,
} from '@store/notifications/selectors'
import { isEqual } from 'lodash'
import { createEffect } from 'solid-js'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'

export const watchSettings = () => {
    const { get, set } = usePersistentStore()

    const createSettingsObject = () => {
        const settings: PersistentSettings = {
            enableNotifications: enableNotifications(),
            enableNotificationsSounds: enableNotificationsSounds(),
            globalNotificationsType: globalNotificationsType(),
            debugMode: 'off',
        }
        return settings
    }

    const handleSaveSettings = async () => {
        get('settings').then((storedSettings) => {
            if (!isEqual(storedSettings, createSettingsObject())) {
                debug(`[Routes]: Saving Settings - ${JSON.stringify(createSettingsObject())}`)
                set('settings', createSettingsObject())
            }
        })
    }

    createEffect(() => {
        const { resume, pause } = useInterval(30000, {
            controls: true,
            callback: handleSaveSettings,
        })

        useEventListener(window, 'blur', () => {
            pause()
            debug(`[Routes]: Saving Settings - ${JSON.stringify(createSettingsObject())}`)
            set('settings', createSettingsObject())
            resume()
        })
    })
}
