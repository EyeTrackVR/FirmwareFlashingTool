import { useRoutes } from '@solidjs/router'
import { isEqual } from 'lodash'
import { createEffect, lazy, onMount, type Component } from 'solid-js'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import { routes } from '.'
import type { PersistentSettings } from '@static/types'
import { Header } from '@containers/Header/Header'
import { ENotificationAction } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/context/api'
import { useAppContext } from '@store/context/app'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { usePersistentStore } from '@store/tauriStore'

const ContextMenu = lazy(() => import('@components/ContextMenu'))
const DebugMenu = lazy(() => import('@components/ContextMenu/DevTools'))

const AppRoutes: Component = () => {
    const Path = useRoutes(routes)

    const { get, set } = usePersistentStore()
    const { doGHRequest, channelMode } = useAppAPIContext()

    const { setDebugMode, getDebugMode } = useAppContext()
    const {
        setEnableNotifications,
        setEnableNotificationsSounds,
        setGlobalNotificationsType,
        getEnableNotificationsSounds,
        getEnableNotifications,
        getGlobalNotificationsType,
        checkPermission,
    } = useAppNotificationsContext()

    const { setContextMenuAnchor, getContextAnchor } = useAppUIContext()

    onMount(() => {
        setContextMenuAnchor('custom-context-menu')
        console.log('context anchor', getContextAnchor())
        //* load the app settings from the persistent store and assign to the global state
        get('settings').then((settings) => {
            if (settings) {
                debug('loading settings')

                setEnableNotifications(settings.enableNotifications)
                setEnableNotificationsSounds(settings.enableNotificationsSounds)
                setGlobalNotificationsType(
                    settings.globalNotificationsType ?? ENotificationAction.APP,
                )

                setDebugMode(settings.debugMode)
            }
        })
        //* Check notification permissions
        checkPermission()
        //* Grab the github release info for OpenIris
    })

    createEffect(() => {
        doGHRequest(channelMode())
    })

    const createSettingsObject = () => {
        const settings: PersistentSettings = {
            enableNotifications: getEnableNotifications(),
            enableNotificationsSounds: getEnableNotificationsSounds(),
            globalNotificationsType: getGlobalNotificationsType(),
            debugMode: getDebugMode(),
        }
        return settings
    }

    const handleSaveSettings = async () => {
        // check if the settings have changed and save to the store if they have
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
        <div class="flex flex-col h-full">
            <Header />
            <div class="flex h-full flex-col overflow-hidden">
                <Path />
                <ContextMenu id="dev-tools">
                    <DebugMenu />
                </ContextMenu>
            </div>
        </div>
    )
}

export default AppRoutes
