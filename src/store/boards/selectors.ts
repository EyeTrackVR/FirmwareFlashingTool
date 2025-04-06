import { terminalState } from './boards'
import { createStoreSelectors } from '@store/utils'

export const { boards } = createStoreSelectors(terminalState)
