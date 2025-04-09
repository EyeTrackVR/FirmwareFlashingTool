import { CAMERA_STATUS } from '@interfaces/boards/enums'
import theme from '@src/common/theme'
import { classNames } from '@src/utils'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    status: CAMERA_STATUS
}

const CameraStatus: Component<IProps> = (props) => {
    const color = createMemo(() => {
        switch (props.status) {
            case CAMERA_STATUS.CONNECTED:
                return 'bg-green-100'
            case CAMERA_STATUS.DISCONNECTED:
                return 'bg-red-100'
            case CAMERA_STATUS.DISCONNECTING:
                return 'bg-red-100'
            case CAMERA_STATUS.CONNECTING:
                return 'bg-yellow-100'
            case CAMERA_STATUS.IN_ACTIVE:
                return 'bg-grey-100'
            default:
                return 'bg-grey-100'
        }
    })

    return <div class={classNames('w-14 h-14 rounded-100', color())} />
}

export default CameraStatus
