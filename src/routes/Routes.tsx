import { Router, useNavigate } from '@solidjs/router'

import Sidebar from '@components/Sidebar'
import { HeaderRoot } from '@containers/Header'
import { ENotificationAction } from '@src/static/types/enums'
import type { PersistentSettings } from '@static/types'
import { useAppAPIContext } from '@store/context/api'
import { useAppContext } from '@store/context/app'
import { useAppNotificationsContext } from '@store/context/notifications'
import { usePersistentStore } from '@store/tauriStore'
import { trackers } from '@store/trackers/selectors'
import { setTrackers } from '@store/trackers/trackers'
import { isEqual } from 'lodash'
import { createEffect, lazy, onMount, Show, type Component } from 'solid-js'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import { routes } from '.'

const Modals = lazy(() => import('@containers/Modals'))

const AppRoutes: Component = () => {
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

    onMount(() => {
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
        get('trackers').then((data) => {
            if (data) {
                debug('loading trackers')
                setTrackers(data?.trackers ?? [])
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
        get('trackers').then((storedTrackers) => {
            if (!isEqual(storedTrackers, { trackers: trackers() })) {
                set('settings', { trackers: trackers() })
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
            set('trackers', { trackers: trackers() })
            resume()
        })
    })

    return (
        <Router
            root={(data) => {
                const navigate = useNavigate()
                return (
                    <div class="flex flex-col h-full">
                        <HeaderRoot />
                        <Modals />
                        <div class="flex h-full flex-row overflow-hidden">
                            <Show
                                when={['/dashboard', '/settings', '/advancedSettings'].includes(
                                    data.location.pathname,
                                )}>
                                <Sidebar
                                    navigation={data.location.pathname}
                                    onClick={(route) => {
                                        navigate(route)
                                    }}
                                />
                            </Show>
                            {data.children}
                        </div>
                    </div>
                )
            }}>
            {routes}
        </Router>
    )
}

export default AppRoutes
