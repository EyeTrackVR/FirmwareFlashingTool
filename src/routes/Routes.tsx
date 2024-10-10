import { useLocation, useNavigate, useRoutes } from '@solidjs/router'
import { isEqual } from 'lodash'
import { createEffect, lazy, onMount, type Component, Show } from 'solid-js'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import { routes } from '.'
import type { PersistentSettings } from '@static/types'
import { Header } from '@containers/Header/Header'
import Sidebar from '@containers/Sidebar/Index'
import { ENotificationAction, NAVIGATION } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/api/api'
import { setDebugMode } from '@store/appContext/appContext'
import { debugMode } from '@store/appContext/selectors'
import { useAppNotificationsContext } from '@store/notifications/notifications'
import { usePersistentStore } from '@store/tauriStore'
import { useAppUIContext } from '@store/ui/ui'

const ContextMenu = lazy(() => import('@components/ContextMenu'))
const DebugMenu = lazy(() => import('@components/ContextMenu/DevTools'))

const AppRoutes: Component = () => {
    const Path = useRoutes(routes)
    const location = useLocation()
    const navigate = useNavigate()

    const { get, set } = usePersistentStore()
    const { doGHRequest, channelMode } = useAppAPIContext()

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
            debugMode: debugMode(),
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
            <Show when={location.pathname !== NAVIGATION.WELCOME}>
                <Header />
            </Show>
            <div class="flex h-full flex-row overflow-hidden">
                <Show when={location.pathname === NAVIGATION.HOME}>
                    <Sidebar
                        navigation={location.pathname}
                        onClick={(route) => {
                            navigate(route)
                        }}
                    />
                </Show>
                <div class="flex w-full h-full">
                    <Path />
                    <ContextMenu id="dev-tools">
                        <DebugMenu />
                    </ContextMenu>
                </div>
            </div>
        </div>
    )
}

export default AppRoutes
