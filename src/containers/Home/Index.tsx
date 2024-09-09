import { createMemo } from 'solid-js'
import { BUTTON_ACTION, CAMERA_DIRECTION, CONNECTION_STATUS } from '@interfaces/enums'
import Homepage from '@pages/Homepage/Index'

const Index = () => {
    const rightCameraStatistics = createMemo(() => {
        return {
            fps: '72',
            latency: '14',
            mbps: '0.1892',
            mode: 'Tracking',
        }
    })

    // add some sort of "hardwareType" to somehow validate the right camera

    const cameras = createMemo(() => {
        return [
            {
                label: 'Camera 1',
                description: 'http:111.111.1.111',
                mode: CONNECTION_STATUS.TRACKING,
            },
            { label: 'Camera 2', description: 'http:111.111.1.111', mode: CONNECTION_STATUS.ERROR },
            { label: 'Both eyes' },
        ]
    })

    const camera = createMemo(() => {
        return {
            address: 'http:111.111.1.111',
            header: 'Camera 1',
        }
    })

    return (
        <Homepage
            rightCameraStatistics={rightCameraStatistics()}
            leftCameraStatistics={rightCameraStatistics()}
            cameras={cameras()}
            leftCamera={camera()}
            rightCamera={camera()}
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
            setRotationValue={(cameraDiraction) => {
                switch (cameraDiraction) {
                    case CAMERA_DIRECTION.RIGHT:
                        break
                    case CAMERA_DIRECTION.LEFT:
                        break
                    default:
                        break
                }
            }}
        />
    )
}

export default Index
