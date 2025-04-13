import { MODAL_TYPE } from '@interfaces/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export const defaultOpenModal = {
    open: false,
    type: MODAL_TYPE.NONE,
}

export interface IOpenModal {
    board?: string
    open: boolean
    type: MODAL_TYPE
}

export interface IUiState {
    navigationStep: string
    openModal: IOpenModal
    serverStatus: CONNECTION_STATUS
    showNotifications?: boolean
    hideModal: boolean
}

const defaultState: IUiState = {
    openModal: defaultOpenModal,
    serverStatus: CONNECTION_STATUS.DISCONNECTED,
    hideModal: false,
    navigationStep: '',
}

const [state, setState] = createStore<IUiState>(defaultState)

export const setOpenModal = (data: IOpenModal) => {
    setState(
        produce((s) => {
            s.openModal = data
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

export const uiState = createMemo(() => state)
