import { lazy, onMount, Suspense } from 'solid-js'
import { AppAPIProvider } from '@store/api/api'
import { handleAppBoot, handleTitlebar } from '@store/appContext/actions'
import { AppNotificationProvider } from '@store/notifications/notifications'
import { AppUIProvider } from '@store/ui/ui'

const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const OperatingSystem = lazy(() => import('@containers/OperatingSystem/Index'))
const Modals = lazy(() => import('@containers/Modals/Index'))
const AppRoutes = lazy(() => import('@routes/Routes'))

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
