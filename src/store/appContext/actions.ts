import { exit } from '@tauri-apps/api/process'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { useEventListener } from 'solidjs-use'
import { attachConsole } from 'tauri-plugin-log-api'
import { ExitCodes } from '@src/static/types/enums'
import { usePersistentStore } from '@src/store/tauriStore'

export const handleAppExit = async (main = false) => {
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

export const handleAppBoot = () => {
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

export const handleTitlebar = (main = false) => {
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

export const getDetachConsole = () => {
    const detachConsole = attachConsole()

    return detachConsole
}

//#endregion
