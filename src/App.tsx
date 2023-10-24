import { lazy, onMount, Suspense } from 'solid-js'
import { useAppContextMain } from './store/context/main'
import { AppProvider } from '@store/context/app'

const AppRoutes = lazy(() => import('@routes/Routes'))
//const NewContextMenu = lazy(() => import('@components/NewMenu'))
//const ExampleMenu = lazy(() => import('@components/NewMenu/DevTools'))
const ToastNotificationWindow = lazy(() => import('@components/Notifications'))

const App = () => {
    const { handleTitlebar, handleAppBoot } = useAppContextMain()
    //const ref = document.getElementById('titlebar')
    onMount(() => {
        handleTitlebar(true)
        handleAppBoot()
    })

    return (
        <div class="App overflow-y-auto items-center">
            <Suspense>
                <AppProvider>
                    <AppRoutes />
                    {/*  <NewContextMenu ref={ref} name="test">
                        <ExampleMenu />
                    </NewContextMenu> */}
                    <ToastNotificationWindow />
                </AppProvider>
            </Suspense>
        </div>
    )
}

export default App
