/* @refresh reload */
import { Router } from '@solidjs/router'
import { render } from 'solid-js/web'
import App from './app'
import { AppContextMainProvider } from '@store/context/main'
import '@styles/imports.css'

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
