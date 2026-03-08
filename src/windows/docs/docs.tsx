/* @refresh reload */
import Header from '@components/Header'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { Router } from '@solidjs/router'
import '@styles/docs-imports.css'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { Suspense } from 'solid-js'
import { render } from 'solid-js/web'

const App = () => {
    return (
        <div class="w-full h-full">
            <Header
                docs
                onClick={async (action: TITLEBAR_ACTION) => {
                    const appWindow = getCurrentWebviewWindow()
                    switch (action) {
                        case TITLEBAR_ACTION.MINIMIZE:
                            appWindow.minimize()
                            break
                        case TITLEBAR_ACTION.MAXIMIZE:
                            appWindow.toggleMaximize()
                            break
                        case TITLEBAR_ACTION.CLOSE: {
                            await appWindow.close()
                            break
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

render(() => <Router root={() => <App />} />, document.getElementById('root') as HTMLElement)
