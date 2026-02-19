import { invoke } from '@tauri-apps/api/core'
import { useEventListener } from 'solidjs-use'

export const watchDOMContent = () => {
    useEventListener(document, 'DOMContentLoaded', () => {
        // check if the window state is saved and restore it if it is
        invoke('handle_save_window_state').then(() => {
            console.log('[App Boot]: saved window state')
        })
    })
}
