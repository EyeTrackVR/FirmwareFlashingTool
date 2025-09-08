import { createStoreSelectors } from '@store/utils'
import { terminalState } from './terminal'

export const {
    firmwareState,
    percentageProgress,
    detailedLogs,
    isActiveProcess,
    logs,
    isSoftwareDownloaded,
    simulationAbortController,
} = createStoreSelectors(terminalState)
