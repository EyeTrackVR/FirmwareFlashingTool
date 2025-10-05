import { HeaderRoot } from '@containers/Header'
import { Router } from '@solidjs/router'
import { ENotificationAction } from '@src/static/types/enums'
import type { PersistentSettings } from '@static/types'
import { usePersistentStore } from '@src/persistenStore'
import { isEqual } from 'lodash'
import { createEffect, onMount, type Component } from 'solid-js'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import { routes } from '.'
import {
    setEnableNotifications,
    setEnableNotificationsSounds,
    setGlobalNotificationsType,
} from '@store/notifications/notifications'
import { checkPermission } from '@store/actions/notifications/checkPermission'
import {
    enableNotifications,
    enableNotificationsSounds,
    globalNotificationsType,
} from '@store/notifications/selectors'

const AppRoutes: Component = () => {
    const { get, set } = usePersistentStore()

    onMount(() => {
        get('settings').then((settings) => {
            if (settings) {
                debug('loading settings')
                setEnableNotifications(settings.enableNotifications)
                setEnableNotificationsSounds(settings.enableNotificationsSounds)
                setGlobalNotificationsType(
                    settings.globalNotificationsType ?? ENotificationAction.APP,
                )
            }
        })
        checkPermission()
    })

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

    return (
        <Router
            root={(data) => {
                return (
                    <div class="flex flex-col h-full">
                        <HeaderRoot />
                        <div class="flex h-full flex-col overflow-hidden">{data.children}</div>
                    </div>
                )
            }}>
            {routes}
        </Router>
    )
}

export default AppRoutes
