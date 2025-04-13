import { createStoreSelectors } from '@store/utils'
import { uiState } from './ui'

export const { navigationStep, openModal, serverStatus, hideModal } = createStoreSelectors(uiState)
