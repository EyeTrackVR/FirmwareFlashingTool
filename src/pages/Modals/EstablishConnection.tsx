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
            appVersion={props.appVersion}
            connectionStatus={props.connectionStatus}
            onClickCloseModal={() => {}}
            isActive={props.isActive}
            onClickSettings={() => {}}
            id={props.id}
            onClickHeader={() => {}}
            isSending={true}>
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
