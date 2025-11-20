import { MODAL_TYPE, STEP_ACTION } from '@interfaces/animation/enums'
import { createStore, produce } from 'solid-js/store'

export interface IOpenModal {
    board?: string
    open: boolean
    type: MODAL_TYPE
}

export interface UiStore {
    activeStepAction: STEP_ACTION
    openModal: IOpenModal
    hideModal: boolean
}

const defaultState: UiStore = {
    activeStepAction: STEP_ACTION.INSTALL_OPENIRIS,
    openModal: {
        open: false,
        type: MODAL_TYPE.NONE,
    },
    hideModal: false,
}

const [state, setState] = createStore<UiStore>(defaultState)

export const setOpenModal = (data: IOpenModal) => {
    setState(
        produce((s) => {
            s.openModal = data
        }),
    )
}

export const setActiveAction = (action: STEP_ACTION) => {
    setState(
        produce((s) => {
            s.activeStepAction = action
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

export const uiState = () => state
