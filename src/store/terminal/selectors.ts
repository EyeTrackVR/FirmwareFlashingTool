import { Accessor, createMemo } from 'solid-js'
import { ITerminalStore, terminalState } from './terminal'

export const {
    firmwareState,
    percentageProgress,
    detailedLogs,
    isActiveProcess,
    logs,
    isSoftwareDownloaded,
    simulationAbortController,
} = [
    'firmwareState',
    'percentageProgress',
    'detailedLogs',
    'isActiveProcess',
    'logs',
    'isSoftwareDownloaded',
    'simulationAbortController',
].reduce(
    (acc, k) => {
        acc[k] = createMemo(() => terminalState()[k])
        return acc
    },
    {} as { [k in keyof ITerminalStore]: Accessor<ITerminalStore[k]> },
)
