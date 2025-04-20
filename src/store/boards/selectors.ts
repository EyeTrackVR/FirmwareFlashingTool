import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import { createStoreSelectors } from '@store/utils'
import { Accessor, createMemo } from 'solid-js'
import { v6 as uuidV6 } from 'uuid'
import { boardState } from './boards'

export const { boards } = createStoreSelectors(boardState)

export const getBoardsCount = createMemo(() => boards().length)

export const getBoards: Accessor<Record<TRACKER_POSITION, ITracker>> = createMemo(() => {
    const data: Record<TRACKER_POSITION, ITracker> = {
        [TRACKER_POSITION.LEFT_EYE]: {
            trackerPosition: TRACKER_POSITION.LEFT_EYE,
            label: 'Left camera',
            address: '--',
            id: uuidV6(),
        },
        [TRACKER_POSITION.RIGHT_EYE]: {
            trackerPosition: TRACKER_POSITION.LEFT_EYE,
            label: 'Right camera',
            address: '--',
            id: uuidV6(),
        },
    }

    boards().forEach((board) => (data[board.trackerPosition] = board))

    return data
})
