import PrimaryButton from '@components/Buttons/PrimaryButton'
import { Modal } from '@components/Modal/Modal'
import ModalHeader from '@components/Modal/ModalHeader'
import Typography from '@components/Typography'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { APP_UPDATER_MODAL_ID } from '@src/static'
import { Component } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickUpdate: () => void
    onClickClose: () => void
    isPrimaryButtonActive: boolean
    isSending: boolean
    isActive: boolean
    version: string
}

const UpdaterModal: Component<IProps> = (props) => {
    return (
        <Modal
            width="w-[350px]"
            isSending={props.isSending}
            version={props.version}
            id={APP_UPDATER_MODAL_ID}
            isActive={props.isActive}
            onClickCloseModal={() => {
                props.onClickClose()
            }}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-24">
                <ModalHeader
                    label="Available update"
                    isSending={props.isSending}
                    onClick={() => {
                        props.onClickClose()
                    }}
                />
                <div class="flex flex-col gap-48">
                    <div class="flex flex-col gap-12">
                        <Typography text="body" color="white">
                            New update is available
                        </Typography>
                        <Typography text="caption" color="white">
                            It seems that you are using an older version of the app. Please update
                            it to access the latest features and experience.
                        </Typography>
                    </div>
                    <PrimaryButton
                        isActive={props.isPrimaryButtonActive}
                        label={!props.isPrimaryButtonActive ? 'Updating...' : 'Install new version'}
                        type="button"
                        onClick={props.onClickUpdate}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default UpdaterModal
