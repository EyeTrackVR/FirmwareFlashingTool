import { Modal } from '@components/Modal'
import Typography from '@components/Typography'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { Component } from 'solid-js'

export interface IProps {
    connectionStatus: CONNECTION_STATUS
    appVersion: string
    isActive: boolean
    id: string
}

const EstablishConnection: Component<IProps> = (props) => {
    return (
        <Modal
            hideHeader
            appVersion={props.appVersion}
            connectionStatus={props.connectionStatus}
            isActive={props.isActive}
            id={props.id}
            isSending
            onClickCloseModal={() => {}}
            onClickHeader={() => {}}>
            <div class="flex flex-col gap-14">
                <Typography color="purple" text="h3" class="text-left">
                    Connecting
                </Typography>
                <Typography color="white" text="caption" class="text-left leading-[26px]">
                    Connecting to the Server...
                </Typography>
            </div>
        </Modal>
    )
}

export default EstablishConnection
