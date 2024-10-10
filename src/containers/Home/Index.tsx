import { createMemo } from 'solid-js'
import { BUTTON_ACTION, TRACKER_TYPE, HARDWARE_TYPE } from '@interfaces/enums'
import Homepage from '@pages/Homepage/Index'
import { boardStatistics, sortedBoards } from '@store/appContext/selectors'

const Home = () => {
    const boards = createMemo(() => {
        const data = Object.values(sortedBoards()).filter((data) => data !== undefined)
        return data
    })

    return (
        <Homepage
            rightCameraStatistics={boardStatistics()?.[HARDWARE_TYPE.RIGHT]}
            leftCameraStatistics={boardStatistics()?.[HARDWARE_TYPE.LEFT]}
            rightCamera={sortedBoards()[HARDWARE_TYPE.RIGHT]}
            leftCamera={sortedBoards()[HARDWARE_TYPE.LEFT]}
            data={boards()}
            onClickAction={(action) => {
                switch (action) {
                    case BUTTON_ACTION.RECALIBRATE_CAMERA:
                        break
                    case BUTTON_ACTION.CROPPING_MODE:
                        break
                    case BUTTON_ACTION.RECALIBRATE:
                        break
                    case BUTTON_ACTION.RECENTER:
                        break
                }
            }}
            setRotationValue={(trackerType) => {
                switch (trackerType) {
                    case TRACKER_TYPE.RIGHT:
                        break
                    case TRACKER_TYPE.LEFT:
                        break
                    default:
                        break
                }
            }}
        />
    )
}

export default Home
