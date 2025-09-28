import {
    ACTION,
    INIT_WIZARD_STEPS,
    FLASH_WIZARD_STEPS,
    TERMINAL_WIZARD_STEPS,
    WIRED_WIZARD_STEPS,
    WIRELESS_WIZARD_STEPS,
    FLASH_MODE,
    PORT_WIZARD_STEPS,
    DEVICE_MODE_WIZARD,
} from '@interfaces/enums'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export type steps =
    | INIT_WIZARD_STEPS
    | FLASH_WIZARD_STEPS
    | TERMINAL_WIZARD_STEPS
    | WIRED_WIZARD_STEPS
    | WIRELESS_WIZARD_STEPS
    | PORT_WIZARD_STEPS
    | DEVICE_MODE_WIZARD

export interface IAnimationState {
    action: ACTION
    step: steps
    prevStep: steps
    activeStep: steps
    showComponent: boolean
    selectedMode: FLASH_MODE
}

const defaultState: IAnimationState = {
    step: INIT_WIZARD_STEPS.PROCESS_INIT,
    activeStep: INIT_WIZARD_STEPS.PROCESS_INIT,
    prevStep: INIT_WIZARD_STEPS.PROCESS_INIT,
    selectedMode: FLASH_MODE.WIRED,
    action: ACTION.NEXT,
    showComponent: true,
}

const [state, setState] = createStore<IAnimationState>(defaultState)

export const setStep = (step: steps, savePrev: boolean = true) => {
    setState(
        produce((s) => {
            if (savePrev) s.prevStep = s.step
            s.step = step
        }),
    )
}

export const setAction = (action: ACTION) => {
    setState(
        produce((s) => {
            s.action = action
        }),
    )
}

export const setActiveStep = (activeStep: steps) => {
    setState(
        produce((s) => {
            s.activeStep = activeStep
        }),
    )
}

export const setShowComponent = (showComponent: boolean) => {
    setState(
        produce((s) => {
            s.showComponent = showComponent
        }),
    )
}

export const setSelectedMode = (mode: FLASH_MODE) => {
    setState(
        produce((s) => {
            s.selectedMode = mode
        }),
    )
}

export const animationState = createMemo(() => state)
