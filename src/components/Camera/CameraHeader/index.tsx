import Typography from '@components/Typography'
import { Component } from 'solid-js'
import CameraStatus from '../../ConnectionStatus'
import { shortAddress } from '@src/utils'
import { IoCamera } from 'solid-icons/io'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import theme from '@src/common/theme'

export interface IProps {
    cameraStatus: CONNECTION_STATUS
    address: string
    label: string
}

const CameraHeader: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col items-start gap-8">
            <div class="flex items-start justify-between w-full">
                <div class="flex gap-12 justify-center">
                    <div class="bg-purple-300 rounded-md flex p-6 rounded-6">
                        <IoCamera size={24} color={theme.colors.white[100]} />
                    </div>
                    <div class="flex flex-col items-start">
                        <Typography color="white" text="body">
                            {props.label}
                        </Typography>
                        <Typography color="white" text="small">
                            {shortAddress(props.address, 24)}
                        </Typography>
                    </div>
                </div>
                <CameraStatus status={props.cameraStatus} />
            </div>
        </div>
    )
}

export default CameraHeader
