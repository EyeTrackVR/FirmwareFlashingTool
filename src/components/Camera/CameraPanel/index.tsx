import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { ParentComponent } from 'solid-js'
import CameraHeader from '../CameraHeader'
import { classNames } from '@src/utils'

export interface IProps {
    styles?: string
    cameraStatus: CONNECTION_STATUS
    label: string
    address: string
}

const CameraPanel: ParentComponent<IProps> = (props) => {
    return (
        <div
            class={classNames(
                props.styles,
                'flex flex-col gap-24 bg-black-900 p-24 rounded-12 border border-solid border-black-800 w-full',
            )}>
            <CameraHeader
                label={props.label}
                address={props.address}
                cameraStatus={props.cameraStatus}
            />
            <div class="relative flex justify-center items-center ">{props.children}</div>
        </div>
    )
}

export default CameraPanel
