import { lazy, onMount, Suspense } from 'solid-js'
import { useAppContextMain } from './store/context/main'
import { AppProvider } from '@store/context/app'

const AppRoutes = lazy(() => import('@routes/Routes'))
const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const Modals = lazy(() => import('@containers/Modals/Index'))
const OperatingSystem = lazy(() => import('@containers/OperatingSystem/Index'))

const App = () => {
    const { handleTitlebar, handleAppBoot } = useAppContextMain()

    onMount(() => {
        handleTitlebar(true)
        handleAppBoot()
    })

    return (
        <Suspense>
            <AppProvider>
                <OperatingSystem />
                <Modals />
                <AppRoutes />
                <ToastNotificationWindow />
            </AppProvider>
        </Suspense>
    )
}

export default App
