import { createStoreSelectors } from '@store/utils'
import { espState } from './esp'

export const { activePort, deviceMode, ports } = createStoreSelectors(espState)
