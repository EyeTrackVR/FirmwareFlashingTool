import { /* useLocation, */ useNavigate, useRoutes } from '@solidjs/router'
import { isEqual } from 'lodash'
import { createEffect, onMount, type Component, lazy } from 'solid-js'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import { routes } from '.'
import type { PersistentSettings } from '@static/types'
import Header from '@components/Header'
import { ENotificationAction } from '@src/static/types/enums'
import { useAppAPIContext } from '@store/context/api'
import { useAppContext } from '@store/context/app'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { usePersistentStore } from '@store/tauriStore'

const ContextMenu = lazy(() => import('@components/ContextMenu'))
const DebugMenu = lazy(() => import('@components/ContextMenu/DevTools'))

const AppRoutes: Component = () => {
    //const params = useLocation()
    const Path = useRoutes(routes)

    const { get, set } = usePersistentStore()
    const { doGHRequest, useRequestHook, getEndpoint } = useAppAPIContext()
    const navigate = useNavigate()

    const { setDebugMode, getDebugMode } = useAppContext()
    const {
        setEnableNotifications,
        setEnableNotificationsSounds,
        setGlobalNotificationsType,
        getEnableNotificationsSounds,
        getEnableNotifications,
        getGlobalNotificationsType,
        checkPermission,
        addNotification,
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
        doGHRequest()
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

    /*   createEffect(() => {
        setUserIsInSettings(params.pathname.match('settings') !== null)
    }) */

    return (
        <main class="pb-[5rem] w-[100%] px-8 max-w-[1920px]">
            <div class="header-wrapper">
                <Header hideButtons={true} name="Welcome!" onClick={() => navigate('/')} />
            </div>
            <div class="pt-[70px]">
                <Path />
            </div>
            <ContextMenu id="dev-tools">
                <DebugMenu />
            </ContextMenu>
        </main>
    )
}

export default AppRoutes
