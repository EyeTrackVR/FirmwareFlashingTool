import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { attachConsole } from 'tauri-plugin-log-api'
import { AppAPIProvider } from './api'
import { AppNotificationProvider } from './notifications'
import { AppUIProvider } from './ui'
import type { AppStore } from '@src/static/types/interfaces'
import type { Context, DebugMode } from '@static/types'
import type { UnlistenFn } from '@tauri-apps/api/event'

interface AppContext {
    getDetachConsole: Accessor<Promise<UnlistenFn>>
    getDebugMode: Accessor<DebugMode>
    setDebugMode: (mode: DebugMode | undefined) => void
}

const AppContext = createContext<AppContext>()
export const AppProvider: Component<Context> = (props) => {
    const detachConsole = attachConsole()

    //#region Store
    const defaultState: AppStore = {
        debugMode: 'off',
    }

    const [state, setState] = createStore<AppStore>(defaultState)

    const setDebugMode = (mode: DebugMode | undefined) => {
        setState(
            produce((s) => {
                s.debugMode = mode || 'info'
            }),
        )
    }

    const appState = createMemo(() => state)
    const getDebugMode = createMemo(() => appState().debugMode)
    const getDetachConsole = createMemo(() => detachConsole)
    //#endregion

    return (
        <AppContext.Provider
            value={{
                getDetachConsole,
                getDebugMode,
                setDebugMode,
            }}>
            <AppUIProvider>
                <AppNotificationProvider>
                    <AppAPIProvider>{props.children}</AppAPIProvider>
                </AppNotificationProvider>
            </AppUIProvider>
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within a AppProvider')
    }
    return context
}
