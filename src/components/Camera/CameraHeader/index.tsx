import Typography from '@components/Typography'
import { CAMERA_STATUS } from '@interfaces/boards/enums'
import { Component } from 'solid-js'
import CameraStatus from '../CameraStatus'
import { shortAddress } from '@src/utils'

export interface IProps {
    cameraStatus: CAMERA_STATUS
    address: string
    label: string
}

const CameraHeader: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col items-start gap-8">
            <div class="flex flex-row items-center justify-between w-full">
                <Typography color="white" text="body">
                    {props.label}
                </Typography>
                <CameraStatus status={props.cameraStatus} />
            </div>
            <Typography color="white" text="small">
                {shortAddress(props.address, 24)}
            </Typography>
        </div>
    )
}

export default CameraHeader
