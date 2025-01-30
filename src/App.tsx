import { AppProvider } from '@store/context/app'
import { lazy, onMount, Suspense } from 'solid-js'
import { useAppContextMain } from './store/context/main'

const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const Modals = lazy(() => import('@containers/Modals/Index'))
const AppRoutes = lazy(() => import('@routes/Routes'))

const App = () => {
    const { handleTitlebar, handleAppBoot } = useAppContextMain()

    onMount(() => {
        handleTitlebar(true)
        handleAppBoot()
    })

    return (
        <Suspense>
            <AppProvider>
                <Modals />
                <AppRoutes />
                <ToastNotificationWindow />
            </AppProvider>
        </Suspense>
    )
}

export default App
