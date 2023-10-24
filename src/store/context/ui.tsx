import { Accessor, createContext, createMemo, useContext, type Component } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { Context } from '@static/types'
import { UiStore } from '@src/static/types/interfaces'

interface AppUIContext {
    openModalStatus: Accessor<boolean | undefined>
    showNotifications: Accessor<boolean | undefined>   
    setOpenModal: (openModal: boolean) => void
}

const AppUIContext = createContext<AppUIContext>()
export const AppUIProvider: Component<Context> = (props) => {
    const defaultState: UiStore = {
        openModal: false,
        showNotifications: true,
    }

    const [state, setState] = createStore<UiStore>(defaultState)

    const setOpenModal = (openModal: boolean) => {
        setState(
            produce((s) => {
                s.openModal = openModal
            }),
        )
    }

    const uiState = createMemo(() => state)

    const openModalStatus = createMemo(() => uiState().openModal)
    const showNotifications = createMemo(() => uiState().showNotifications)

    return (
        <AppUIContext.Provider
            value={{
                openModalStatus,
                showNotifications,
                setOpenModal,
            }}>
            {props.children}
        </AppUIContext.Provider>
    )
}

export const useAppUIContext = () => {
    const context = useContext(AppUIContext)
    if (context === undefined) {
        throw new Error('useAppUIContext must be used within an AppUIProvider')
    }
    return context
}
