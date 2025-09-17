import { ACTION, FLASH_WIZARD_STEPS } from '@interfaces/enums'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface IAnimationState {
    action: ACTION
    step: FLASH_WIZARD_STEPS
    prevStep: FLASH_WIZARD_STEPS
    activeStep: FLASH_WIZARD_STEPS
    showComponent: boolean
}

const defaultState: IAnimationState = {
    step: FLASH_WIZARD_STEPS.SELECT_MODE,
    activeStep: FLASH_WIZARD_STEPS.SELECT_MODE,
    prevStep: FLASH_WIZARD_STEPS.SELECT_MODE,
    action: ACTION.NEXT,
    showComponent: true,
}

const [state, setState] = createStore<IAnimationState>(defaultState)

export const setStep = (step: FLASH_WIZARD_STEPS) => {
    setState(
        produce((s) => {
            s.prevStep = s.step
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

export const setActiveStep = (activeStep: FLASH_WIZARD_STEPS) => {
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

export const animationState = createMemo(() => state)
