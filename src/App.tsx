import { lazy, onMount, Suspense } from 'solid-js'
import { AppAPIProvider } from '@store/api/api'
import { handleAppBoot, handleTitlebar } from '@store/appContext/actions'
import { AppNotificationProvider } from '@store/notifications/notifications'
import { AppUIProvider } from '@store/ui/ui'

const AppRoutes = lazy(() => import('@routes/Routes'))
const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const Modals = lazy(() => import('@containers/Modals/Index'))
const OperatingSystem = lazy(() => import('@containers/OperatingSystem/Index'))

const App = () => {
    onMount(() => {
        handleTitlebar(true)
        handleAppBoot()
    })

    return (
        <Suspense>
            <AppUIProvider>
                <AppNotificationProvider>
                    <AppAPIProvider>
                        <OperatingSystem />
                        <Modals />
                        <AppRoutes />
                        <ToastNotificationWindow />
                    </AppAPIProvider>
                </AppNotificationProvider>
            </AppUIProvider>
        </Suspense>
    )
}

export default App
