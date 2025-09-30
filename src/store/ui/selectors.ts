import { createStoreSelectors } from '@store/utils'
import { uiState } from './ui'

export const { hideModal, openModal, activeStepAction } = createStoreSelectors(uiState)
