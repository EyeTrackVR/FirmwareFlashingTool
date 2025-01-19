/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'
import { AppContextMainProvider } from '@store/context/main'
import '@styles/imports.css'

render(
    () => (
        <AppContextMainProvider>
            <App />
        </AppContextMainProvider>
    ),
    document.getElementById('root') as HTMLElement,
)
