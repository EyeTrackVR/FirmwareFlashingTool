import { lazy, onMount, Suspense } from 'solid-js'
import { useAppContextMain } from './store/context/main'
import { AppProvider } from '@store/context/app'

const AppRoutes = lazy(() => import('@routes/Routes'))
const ToastNotificationWindow = lazy(() => import('@components/Notifications'))

const App = () => {
    const { handleTitlebar, handleAppBoot } = useAppContextMain()

    onMount(() => {
        handleTitlebar(true)
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
