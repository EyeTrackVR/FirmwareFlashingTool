import { Accessor, createMemo } from 'solid-js'
import { terminalState } from './boards'
import { createStoreSelectors } from '@store/utils'
import { TRACKER_POSITION } from '@interfaces/boards/enums'
import { IBoard } from '@interfaces/boards/interfaces'
import { v6 as uuidV6 } from 'uuid'
export const { boards } = createStoreSelectors(terminalState)

export const getBoards: Accessor<Record<TRACKER_POSITION, IBoard>> = createMemo(() => {
    const data: Record<TRACKER_POSITION, IBoard> = {
        [TRACKER_POSITION.LEFT_TRACKER]: {
            TrackerPosition: TRACKER_POSITION.LEFT_TRACKER,
            label: 'Left camera',
            address: '--',
            id: uuidV6(),
        },
        [TRACKER_POSITION.RIGHT_TRACKER]: {
            TrackerPosition: TRACKER_POSITION.LEFT_TRACKER,
            label: 'Right camera',
            address: '--',
            id: uuidV6(),
        },
    }

    boards().forEach((board) => (data[board.TrackerPosition] = board))

    return data
})
