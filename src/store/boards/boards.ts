import { ITracker } from '@interfaces/trackers/interfaces'
import { createMemo } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

export interface IBoardState {
    boards: ITracker[]
}

const defaultState: IBoardState = {
    boards: [],
}

const [state, setState] = createStore<IBoardState>(defaultState)

export const setBoard = (board: ITracker) => {
    setState(
        produce((s) => {
            s.boards.push(board)
        }),
    )
}

export const setBoards = (boards: ITracker[]) => {
    setState(
        produce((s) => {
            s.boards = boards
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

export const updateBoard = (board: ITracker) => {
    setState(
        produce((s) => {
            s.boards = s.boards.map((item) => (item.id === board.id ? board : item))
        }),
    )
}

export const boardState = createMemo(() => state)
