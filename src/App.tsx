import { NOTIFICATION_ACTION } from '@interfaces/notifications/enums'
import { checkPermission } from '@store/actions/notifications/checkPermission'
import {
    setEnableNotifications,
    setEnableNotificationsSounds,
    setGlobalNotificationsType,
} from '@store/notifications/notifications'
import { lazy, onMount, Suspense } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import { usePersistentStore } from './persistenStore'
import { runWatchers } from './watchers'
const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const Modals = lazy(() => import('@containers/Modals'))
const AppRoutes = lazy(() => import('@routes/Routes'))

const App = () => {
    const { get } = usePersistentStore()

    onMount(() => {
        get('settings').then((settings) => {
            if (settings) {
                debug('loading settings')
                setEnableNotifications(settings.enableNotifications)
                setEnableNotificationsSounds(settings.enableNotificationsSounds)
                setGlobalNotificationsType(
                    settings.globalNotificationsType ?? NOTIFICATION_ACTION.APP,
                )
            }
        })

        checkPermission()
        runWatchers()
    })

    return (
        <Suspense>
            <Modals />
            <AppRoutes />
            <ToastNotificationWindow />
        </Suspense>
    )
}

export default App
