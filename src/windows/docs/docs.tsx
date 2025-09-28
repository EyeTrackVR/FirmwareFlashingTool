/* @refresh reload */
import Header from '@components/Header'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { Router } from '@solidjs/router'
import { AppContextMainProvider } from '@src/store/context/main'
import '@styles/docs-imports.css'
import { appWindow } from '@tauri-apps/api/window'
import { Suspense } from 'solid-js'
import { render } from 'solid-js/web'

const App = () => {
    return (
        <div class="w-full h-full">
            <Header
                docs
                onClick={async (action: TITLEBAR_ACTION) => {
                    switch (action) {
                        case TITLEBAR_ACTION.MINIMIZE:
                            appWindow.minimize()
                            break
                        case TITLEBAR_ACTION.MAXIMIZE:
                            appWindow.toggleMaximize()
                            break
                        case TITLEBAR_ACTION.CLOSE: {
                            await appWindow.close()
                        }
                        default:
                            return
                    }
                }}
            />
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
        <Router
            root={() => {
                return (
                    <AppContextMainProvider>
                        <App />
                    </AppContextMainProvider>
                )
            }}
        />
    ),
    document.getElementById('root') as HTMLElement,
)
