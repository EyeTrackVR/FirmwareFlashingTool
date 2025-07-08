import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { MODAL_TYPE } from '@interfaces/ui/enums'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export const defaultActiveModal = {
    open: false,
    type: MODAL_TYPE.NONE,
}

export interface IActiveModal {
    board?: string
    open: boolean
    type: MODAL_TYPE
}

export interface IUiState {
    navigationStep: string
    activeModal: IActiveModal
    serverStatus: CONNECTION_STATUS
    showNotifications?: boolean
    isStreamSettingsActive: boolean
    hideModal: boolean
    firstLoad: boolean
}

const defaultState: IUiState = {
    activeModal: defaultActiveModal,
    serverStatus: CONNECTION_STATUS.DISCONNECTED,
    isStreamSettingsActive: false,
    firstLoad: true,
    hideModal: false,
    navigationStep: '',
}

const [state, setState] = createStore<IUiState>(defaultState)

export const setActiveModal = (data: IActiveModal) => {
    setState(
        produce((s) => {
            s.activeModal = data
        }),
    )
}

export const setHideModal = () => {
    setState(
        produce((s) => {
            s.hideModal = !s.hideModal
        }),
    )
}

export const setFirstLoadStatus = (status: boolean) => {
    setState(
        produce((s) => {
            s.firstLoad = status
        }),
    )
}

export const setNavigationStep = (step: string) => {
    setState(
        produce((s) => {
            s.navigationStep = step
        }),
    )
}

export const setServerStatus = (status: CONNECTION_STATUS) => {
    setState(
        produce((s) => {
            s.serverStatus = status
        }),
    )
}

export const setIsStreamSettingsActive = (status: boolean) => {
    setState(
        produce((s) => {
            s.isStreamSettingsActive = status
        }),
    )
}

export const uiState = createMemo(() => state)
