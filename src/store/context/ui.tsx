import { Accessor, createContext, createMemo, useContext, type Component } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { Context } from '@static/types'
import type { IOpenModal, MenuOpen, UiStore } from '@static/types/interfaces'
import { MODAL_TYPE } from '@interfaces/enums'

interface AppUIContext {
    modal: Accessor<IOpenModal>
    menuOpenStatus: Accessor<MenuOpen | null | undefined>
    getContextAnchor: Accessor<HTMLElement | null | undefined>
    showNotifications: Accessor<boolean | undefined>
    setOpenModal: (data: IOpenModal) => void
    setMenu: (menuOpen: MenuOpen | null) => void
    setContextMenuAnchor: (id: string) => void
}

const AppUIContext = createContext<AppUIContext>()
export const AppUIProvider: Component<Context> = (props) => {
    const defaultState: UiStore = {
        openModal: {
            open: false,
            type: MODAL_TYPE.NONE,
        },
        showNotifications: true,
        menuOpen: null,
    }

    const [state, setState] = createStore<UiStore>(defaultState)

    const setMenu = (menuOpen: MenuOpen | null) => {
        setState(
            produce((s) => {
                s.menuOpen = menuOpen || null
            }),
        )
    }

    const setContextMenuAnchor = (id: string) => {
        const anchor = document.getElementById(id)
        if (anchor) {
            setState(
                produce((s) => {
                    s.contextAnchor = anchor
                }),
            )
        }
    }

    const setOpenModal = (data: IOpenModal) => {
        setState(
            produce((s) => {
                s.openModal = data
            }),
        )
    }

    const uiState = createMemo(() => state)

    const modal = createMemo(() => uiState().openModal)
    const showNotifications = createMemo(() => uiState().showNotifications)
    const menuOpenStatus = createMemo(() => uiState().menuOpen)
    const getContextAnchor = createMemo(() => uiState().contextAnchor)

    return (
        <AppUIContext.Provider
            value={{
                modal,
                showNotifications,
                menuOpenStatus,
                getContextAnchor,
                setOpenModal,
                setMenu,
                setContextMenuAnchor,
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
