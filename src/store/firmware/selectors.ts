import { createStoreSelectors } from '@store/utils'
import { firmwareState } from './firmware'

export const {
    activeBoard,
    channelMode,
    firmwareType,
    ghAPI,
    loader,
    manifestPath,
    restAPI,
    trackerName,
} = createStoreSelectors(firmwareState)
