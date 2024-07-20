import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { FLASH_STATUS, FLASH_STEP } from '@interfaces/enums'
import { type IFlashState } from '@interfaces/interfaces'
export interface ITerminalStore {
    simulationAbortController: AbortController
    isSoftwareDownloaded: boolean
    firmwareState: Record<FLASH_STEP, IFlashState> | object
    percentageProgress: number // %
    isActiveProcess: boolean
    detailedLogs: string[]
    logs: Record<FLASH_STEP, string[]> | object
}

export interface IFirmwareState {
    step: FLASH_STEP
    object: IFlashState
}

export const defaultLogsState = {
    status: FLASH_STATUS.NONE,
    label: '',
}

const defaultState: ITerminalStore = {
    simulationAbortController: new AbortController(),
    isSoftwareDownloaded: false,
    isActiveProcess: false,
    percentageProgress: 0, // %
    firmwareState: {},
    detailedLogs: [],
    logs: {},
}

const [state, setState] = createStore<ITerminalStore>(defaultState)

export const updateFirmwareState = ({ step, object }: IFirmwareState) => {
    setState(
        produce((s) => {
            s.firmwareState[step] = object
        }),
    )
}

export const deleteFirmwareState = (step: FLASH_STEP) => {
    setState(
        produce((s) => {
            delete s.firmwareState[step]
        }),
    )
}

export const setProcessStatus = (status: boolean) => {
    setState(
        produce((s) => {
            s.isActiveProcess = status
        }),
    )
}

export const setLogs = (step: FLASH_STEP, log: string[], limitLogs?: boolean) => {
    setState(
        produce((s) => {
            if (!limitLogs) {
                s.logs[step] = [...(s.logs[step] ?? []), ...log]
            } else {
                const existingLogs = s.logs[step] ?? []
                const totalLogs = existingLogs.length + log.length
                const maxLogs = 5000

                s.logs[step] =
                    totalLogs > maxLogs
                        ? [...existingLogs.slice(totalLogs - maxLogs), ...log]
                        : [...existingLogs, ...log]
            }
        }),
    )
}

export const restartFirmwareState = () => {
    setState(
        produce((s) => {
            s.firmwareState = {}
            s.percentageProgress = 0
            s.detailedLogs = []
        }),
    )
}

export const restartLogsState = () => {
    setState(
        produce((s) => {
            s.detailedLogs = []
        }),
    )
}

export const clearLogs = () => {
    setState(
        produce((s) => {
            s.firmwareState = {}
            s.logs = {}
        }),
    )
}

export const setInstallationProgress = (percentageProgress: number) => {
    setState(
        produce((s) => {
            s.percentageProgress = percentageProgress
        }),
    )
}

export const setDetailedLogs = (log: string) => {
    setState(
        produce((s) => {
            s.detailedLogs = [...s.detailedLogs, log]
        }),
    )
}

export const setIsSoftwareDownloaded = (status: boolean) => {
    setState(
        produce((s) => {
            s.isSoftwareDownloaded = status
        }),
    )
}

export const setAbortController = (description?: string) => {
    setState(
        produce((s) => {
            s.simulationAbortController.abort(description)
            s.simulationAbortController = new AbortController()
        }),
    )
}

export const terminalState = createMemo(() => state)
