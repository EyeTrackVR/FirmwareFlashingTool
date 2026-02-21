import { NOTIFICATION_ACTION } from '@interfaces/notifications/enums'
import { checkPermission } from '@store/actions/notifications/checkPermission'
import {
    setEnableNotifications,
    setEnableNotificationsSounds,
    setGlobalNotificationsType,
} from '@store/notifications/notifications'
import { debug } from '@tauri-apps/plugin-log'
import { lazy, onMount, Suspense } from 'solid-js'
import { Toaster } from 'solid-sonner'
import { usePersistentStore } from './persistenStore'
import { runWatchers } from './watchers'
const Modals = lazy(() => import('@containers/Modals'))
const AppRoutes = lazy(() => import('@routes/Routes'))

const App = () => {
    const { get } = usePersistentStore()

    onMount(() => {
        get('settings').then((settings) => {
            console.log('got settings', settings)
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
            <Toaster position="top-center" visibleToasts={4} duration={3000} />
        </Suspense>
    )
}

export default App
