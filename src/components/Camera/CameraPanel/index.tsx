import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { Component } from 'solid-js'
import Camera from '../Camera'
import CameraHeader from '../CameraHeader'

export interface IProps {
    label: string
    address: string
}

const CameraPanel: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col gap-24 bg-black-900 p-24 rounded-12 border border-solid border-black-800 min-[1001px]:max-w-[600px] w-full">
            <CameraHeader
                label={props.label}
                address={props.address}
                cameraStatus={CONNECTION_STATUS.INACTIVE}
            />
            <div class="w-full flex justify-center">
                <Camera />
            </div>
        </div>
    )
}

export default CameraPanel
