import { exit } from '@tauri-apps/api/process'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
import { useEventListener } from 'solidjs-use'
import { attachConsole } from 'tauri-plugin-log-api'
import type { Context } from '@static/types'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { ExitCodes } from '@src/static/types/enums'
import { usePersistentStore } from '@src/store/tauriStore'

interface AppContextMain {
    getDetachConsole: Accessor<Promise<UnlistenFn>>
    handleAppBoot: () => void
    handleTitlebar: (main?: boolean) => void
}

const AppContextMain = createContext<AppContextMain>()
export const AppContextMainProvider: Component<Context> = (props) => {
    const detachConsole = attachConsole()

    const getDetachConsole = createMemo(() => detachConsole)
    //#region Global Hooks
    const handleAppExit = async (main = false) => {

        await invoke('handle_save_window_state')
        console.log('[App Close]: saved window state')

        if (main) {
            const { save } = usePersistentStore()
            await save()

            // stopMDNS()
            await exit(ExitCodes.USER_EXIT)
        }
        await appWindow.close()
    }

    const handleAppBoot = () => {
        //const { set, get } = usePersistentStore()

        console.log('[App Boot]: Frontend Initialization Starting')
        useEventListener(document, 'DOMContentLoaded', () => {
            // check if the window state is saved and restore it if it is
            invoke('handle_save_window_state').then(() => {
                console.log('[App Boot]: saved window state')
            })
        })

        //TODO: Start mdns client
    }

    const handleTitlebar = (main = false) => {
        const titlebar = document.getElementsByClassName('titlebar')
        if (titlebar) {
            useEventListener(document.getElementById('titlebar-minimize'), 'click', () => {
                appWindow.minimize()
            })
            useEventListener(document.getElementById('titlebar-maximize'), 'click', () => {
                appWindow.toggleMaximize()
            })
            useEventListener(document.getElementById('titlebar-close'), 'click', async () => {
                await handleAppExit(main)
            })
        }
    }
    //#endregion

    return (
        <AppContextMain.Provider
            value={{
                getDetachConsole,
                handleAppBoot,
                handleTitlebar,
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
