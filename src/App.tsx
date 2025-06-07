import { lazy, onCleanup, onMount, Suspense } from 'solid-js'
import { getEyeTrackVrController } from './Services/etvr/connection'
import { setServerStatus } from '@store/ui/ui'
import { addNotification } from '@store/notifications/actions'
import { ENotificationType } from '@interfaces/enums'
import { AppAPIProvider } from '@store/context/api'
import { useEventListener } from 'solidjs-use'
import { invoke } from '@tauri-apps/api/tauri'

const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const AppRoutes = lazy(() => import('@routes/Routes'))

const App = () => {
    const monitorServerStatus = async () => {
        const interval = setInterval(async () => {
            const client = getEyeTrackVrController()
            const serverStatus = await client.getServerStatus()
            setServerStatus(serverStatus)
        }, 5000)
        onCleanup(() => clearInterval(interval))
    }

    const handleAppBoot = () => {
        useEventListener(document, 'DOMContentLoaded', () => {
            // check if the window state is saved and restore it if it is
            invoke('handle_save_window_state').then(() => {
                console.log('[App Boot]: saved window state')
            })
        })
    }

    onMount(() => {
        monitorServerStatus().catch(() => {
            addNotification({
                title: 'Failed to monitor server status',
                message: 'Failed to monitor server status',
                type: ENotificationType.INFO,
            })
        })
        handleAppBoot()
    })

    return (
        <Suspense>
            <AppAPIProvider>
                <AppRoutes />
                <ToastNotificationWindow />
            </AppAPIProvider>
        </Suspense>
    )
}

export default App
