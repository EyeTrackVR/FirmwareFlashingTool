import { Modal } from '@components/Modal'
import Typography from '@components/Typography'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { Component } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    connectionStatus: CONNECTION_STATUS
    appVersion: string
    isActive: boolean
    id: string
}

const CloseApp: Component<IProps> = (props) => {
    return (
        <Modal
            appVersion={props.appVersion}
            connectionStatus={props.connectionStatus}
            onClickCloseModal={() => {}}
            isActive={props.isActive}
            id={props.id}
            onClickHeader={props.onClickHeader}
            isSending>
            <div class="flex flex-col gap-24 items-center">
                <div class="inline-flex items-center justify-center w-[34px] h-[34px]">
                    <img
                        src="images/logo.png"
                        class="min-w-[42px] min-h-[42px] w-[42px] h-[42px] transition-opacity duration-300"
                    />
                </div>
                <Typography text="body" color="white">
                    Shutting down EyeTrackVR
                </Typography>
                <span class="loading loading-bars loading-xl"></span>
            </div>
        </Modal>
    )
}

export default CloseApp
