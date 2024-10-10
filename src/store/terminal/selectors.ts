import { terminalState } from './terminal'
import { createStoreSelectors } from '@store/utils'

export const {
    firmwareState,
    percentageProgress,
    detailedLogs,
    isActiveProcess,
    logs,
    isSoftwareDownloaded,
    simulationAbortController,
} = createStoreSelectors(terminalState)
