import { IBoard } from '@interfaces/boards/interfaces'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface IBoardState {
    boards: IBoard[]
}

const defaultState: IBoardState = {
    boards: [],
}

const [state, setState] = createStore<IBoardState>(defaultState)

export const setBoard = (board: IBoard) => {
    setState(
        produce((s) => {
            s.boards.push(board)
        }),
    )
}

export const removeBoard = (id: string) => {
    setState(
        produce((s) => {
            s.boards = s.boards.filter((item) => item.id !== id)
        }),
    )
}

export const updateBoard = (board: IBoard) => {
    setState(
        produce((s) => {
            s.boards = s.boards.map((item) => (item.address === board.address ? board : item))
        }),
    )
}

export const terminalState = createMemo(() => state)
