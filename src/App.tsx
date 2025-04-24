import { AppProvider } from '@store/context/app'
import { lazy, onCleanup, onMount, Suspense } from 'solid-js'
import { useAppContextMain } from './store/context/main'
import { getEyeTrackVrController } from './Services/etvr/connection'
import { setServerStatus } from '@store/ui/ui'

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
            // TODO: add notification
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
