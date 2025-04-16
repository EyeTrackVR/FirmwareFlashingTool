import { createStoreSelectors } from '@store/utils'
import { uiState } from './ui'

export const { navigationStep, activeModal, serverStatus, hideModal } =
    createStoreSelectors(uiState)
