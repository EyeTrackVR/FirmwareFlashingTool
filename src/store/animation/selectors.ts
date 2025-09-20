import { createStoreSelectors } from '@store/utils'
import { animationState } from './animation'

export const { activeStep, action, step, showComponent, prevStep, selectedMode } =
    createStoreSelectors(animationState)
