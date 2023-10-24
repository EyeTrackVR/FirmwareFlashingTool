/* @refresh reload */
import { Router } from '@solidjs/router'
import { onMount, Suspense } from 'solid-js'
import { render } from 'solid-js/web'
import { useAppContextMain, AppContextMainProvider } from '@src/store/context/main'
import '@styles/docs-imports.css'

const App = () => {
    const { handleTitlebar } = useAppContextMain()

    onMount(() => {
        handleTitlebar()
    })

    return (
        <div class="w-[100%] h-[100%]">
            <Suspense>
                <div class="iframe">
                    <iframe
                        style={{
                            display: 'block',
                            width: '100%',
                            border: 'none',
                            'overflow-y': 'auto',
                            'overflow-x': 'hidden',
                        }}
                        src="https://docs.eyetrackvr.dev"
                        width="100%"
                        height="100%"
                    />
                </div>
            </Suspense>
        </div>
    )
}

render(
    () => (
        <Router>
            <AppContextMainProvider>
                <App />
            </AppContextMainProvider>
        </Router>
    ),
    document.getElementById('root') as HTMLElement,
)
