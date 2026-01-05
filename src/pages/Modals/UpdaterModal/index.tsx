import { Modal } from '@components/Modal/Modal'
import ModalHeader from '@components/Modal/ModalHeader'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { APP_UPDATER_MODAL_ID } from '@src/static'
import { UpdateResult } from '@tauri-apps/api/updater'
import { Component } from 'solid-js'

export interface IProps {
    updateAvailable?: UpdateResult
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    isSending: boolean
    isActive: boolean
    version: string
    activeBoard: string
}

const UpdaterModal: Component<IProps> = (props) => {
    return (
        <Modal
            width="w-[500px]"
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
                    onClick={() => {
                        props.onClickClose()
                    }}
                />
                <div class="flex flex-col gap-12"></div>
            </div>
        </Modal>
    )
}

export default UpdaterModal
