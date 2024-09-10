import { createMemo } from 'solid-js'
import {
    BUTTON_ACTION,
    CAMERA_DIRECTION,
    CONNECTION_STATUS,
    HARDWARE_TYPE,
} from '@interfaces/enums'
import { ICameraHardware } from '@interfaces/interfaces'
import Homepage from '@pages/Homepage/Index'

// static data
const data: Record<Exclude<HARDWARE_TYPE, HARDWARE_TYPE.BOTH>, ICameraHardware> = {
    [HARDWARE_TYPE.LEFT]: {
        label: 'Camera 1',
        description: 'Lorem ipsum',
        address: 'http:111.111.1.111',
        video: 'http://99.0.999.99',
        mode: CONNECTION_STATUS.TRACKING,
        hardwareType: HARDWARE_TYPE.LEFT,
    },
    [HARDWARE_TYPE.RIGHT]: {
        label: 'Camera 2',
        description: 'Lorem ipsum',
        address: 'http:111.111.1.111',
        video: 'http://99.0.999.99',
        mode: CONNECTION_STATUS.ERROR,
        hardwareType: HARDWARE_TYPE.RIGHT,
    },
}

// This will change later, at the moment it is built on static data

const Index = () => {
    const rightCameraStatistics = createMemo(() => {
        return {
            fps: '72',
            latency: '14',
            mbps: '0.1892',
            mode: 'Tracking',
        }
    })

    const cameras = createMemo(() => {
        const cameras = Object.values(data)
        if (cameras.length >= 2) {
            return [
                ...cameras,
                {
                    label: HARDWARE_TYPE.BOTH,
                    description: 'Both eyes',
                    hardwareType: HARDWARE_TYPE.BOTH,
                },
            ]
        }
        return cameras
    })

    const rightCamera = createMemo(() => {
        const camera = data[HARDWARE_TYPE.RIGHT]
        if (!camera) return undefined
        return {
            address: camera?.address ?? '----',
            video: camera?.video ?? '----',
            header: camera.label,
        }
    })

    const leftCamera = createMemo(() => {
        const camera = data[HARDWARE_TYPE.LEFT]
        if (!camera) return undefined
        return {
            address: camera?.address ?? '----',
            video: camera?.video ?? '----',
            header: camera.label,
        }
    })

    return (
        <Homepage
            rightCameraStatistics={rightCameraStatistics()}
            leftCameraStatistics={rightCameraStatistics()}
            rightCamera={rightCamera()}
            leftCamera={leftCamera()}
            cameras={cameras()}
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
