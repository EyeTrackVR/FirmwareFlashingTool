import { Accessor } from 'solid-js'
import { appContextState } from './appContext'
import { CONNECTION_STATUS, HARDWARE_TYPE } from '@interfaces/enums'
import { IBoardHardware } from '@interfaces/interfaces'
import { createStoreSelectors } from '@store/utils'

export const { boardStatistics, boards, debugMode } = createStoreSelectors(appContextState)

export const sortedBoards: Accessor<Record<HARDWARE_TYPE, IBoardHardware | undefined>> = () => {
    const data: Record<HARDWARE_TYPE, IBoardHardware | undefined> = {
        [HARDWARE_TYPE.RIGHT]: undefined,
        [HARDWARE_TYPE.LEFT]: undefined,
        [HARDWARE_TYPE.BOTH]: undefined,
    }

    if (boards().length >= 2) {
        data[HARDWARE_TYPE.BOTH] = {
            label: HARDWARE_TYPE.BOTH,
            address: HARDWARE_TYPE.BOTH,
            mode: CONNECTION_STATUS.DISABLED,
            hardwareType: HARDWARE_TYPE.BOTH,
        }
    } else {
        data[HARDWARE_TYPE.BOTH] = undefined
    }

    boards().forEach((board) => {
        data[board.hardwareType] = board
    })

    return data
}
