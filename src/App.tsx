import { invoke } from '@tauri-apps/api/tauri'
import { lazy, onMount, Suspense } from 'solid-js'
import { useEventListener } from 'solidjs-use'
import { runWatchers } from './watchers'

const ToastNotificationWindow = lazy(() => import('@components/Notifications'))
const Modals = lazy(() => import('@containers/Modals'))
const AppRoutes = lazy(() => import('@routes/Routes'))

const App = () => {
    onMount(() => {
        runWatchers()
        useEventListener(document, 'DOMContentLoaded', () => {
            // check if the window state is saved and restore it if it is
            invoke('handle_save_window_state').then(() => {
                console.log('[App Boot]: saved window state')
            })
        })
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
