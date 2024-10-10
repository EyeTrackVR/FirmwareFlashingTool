/* @refresh reload */
import { Router } from '@solidjs/router'
import { onMount, Suspense } from 'solid-js'
import { render } from 'solid-js/web'
import '@styles/docs-imports.css'
import { handleTitlebar } from '@store/appContext/actions'

const App = () => {
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
            <App />
        </Router>
    ),
    document.getElementById('root') as HTMLElement,
)
