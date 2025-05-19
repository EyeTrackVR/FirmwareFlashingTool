import { AppProvider } from '@store/context/app'
import { lazy, onCleanup, onMount, Suspense } from 'solid-js'
import { useAppContextMain } from './store/context/main'
import { getEyeTrackVrController } from './Services/etvr/connection'
import { setServerStatus } from '@store/ui/ui'
import { addNotification } from '@store/notifications/actions'
import { ENotificationType } from '@interfaces/enums'

const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const AppRoutes = lazy(() => import('@routes/Routes'))

const App = () => {
    const { handleAppBoot } = useAppContextMain()

    const monitorServerStatus = async () => {
        const interval = setInterval(async () => {
            const client = getEyeTrackVrController()
            const serverStatus = await client.getServerStatus()
            setServerStatus(serverStatus)
        }, 5000)
        onCleanup(() => clearInterval(interval))
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
            <AppProvider>
                <AppRoutes />
                <ToastNotificationWindow />
            </AppProvider>
        </Suspense>
    )
}

export default App
