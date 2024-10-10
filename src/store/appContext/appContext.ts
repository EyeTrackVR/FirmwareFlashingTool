import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { IBoardHardware, IBoardStatistics } from '@interfaces/interfaces'
import { HARDWARE_TYPE } from '@interfaces/enums'
import { DebugMode } from '@interfaces/index'

export interface IAppContextStore {
    debugMode: DebugMode
    boards: IBoardHardware[]
    boardStatistics: Record<
        Exclude<HARDWARE_TYPE, HARDWARE_TYPE.BOTH>,
        IBoardStatistics | undefined
    >
}

export const defaultBoardStatistics: Record<
    Exclude<HARDWARE_TYPE, HARDWARE_TYPE.BOTH>,
    IBoardStatistics | undefined
> = {
    [HARDWARE_TYPE.LEFT]: undefined,
    [HARDWARE_TYPE.RIGHT]: undefined,
}

const defaultState: IAppContextStore = {
    boardStatistics: defaultBoardStatistics,
    debugMode: 'off',
    boards: [],
}

const [state, setState] = createStore<IAppContextStore>(defaultState)
export const setBoard = (board: IBoardHardware) => {
    setState(
        produce((s) => {
            s.boards.push(board)
        }),
    )
}

export const setDeleteBoard = (hardwareType: HARDWARE_TYPE) => {
    setState(
        produce((s) => {
            s.boards = s.boards.filter((board) => board.hardwareType !== hardwareType)
        }),
    )
}

export const setUpdateBoard = (hardwareType: HARDWARE_TYPE, label: string, address: string) => {
    setState(
        produce((s) => {
            const board = s.boards.find((board) => board.hardwareType === hardwareType)
            if (board) {
                board.label = label
                board.address = address
            }
        }),
    )
}

export const setDebugMode = (mode: DebugMode | undefined) => {
    setState(
        produce((s) => {
            s.debugMode = mode ?? 'info'
        }),
    )
}

export const appContextState = createMemo(() => state)
