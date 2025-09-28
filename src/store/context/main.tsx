import type { Context } from '@static/types'
import { invoke } from '@tauri-apps/api/tauri'
import { createContext, useContext, type Component } from 'solid-js'
import { useEventListener } from 'solidjs-use'
import { attachConsole } from 'tauri-plugin-log-api'

interface AppContextMain {
    handleAppBoot: () => void
}

const AppContextMain = createContext<AppContextMain>()
export const AppContextMainProvider: Component<Context> = (props) => {
    const detachConsole = attachConsole()

    const handleAppBoot = () => {
        console.log('[App Boot]: Frontend Initialization Starting')
        useEventListener(document, 'DOMContentLoaded', () => {
            // check if the window state is saved and restore it if it is
            invoke('handle_save_window_state').then(() => {
                console.log('[App Boot]: saved window state')
            })
        })
    }

    return (
        <AppContextMain.Provider
            value={{
                handleAppBoot,
            }}>
            {props.children}
        </AppContextMain.Provider>
    )
}

export const useAppContextMain = () => {
    const context = useContext(AppContextMain)
    if (context === undefined) {
        throw new Error('useAppContextMain must be used within a AppContextMainProvider')
    }
    return context
}
