import { Footer } from '@components/Footer'
import { Modal } from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import Typography from '@components/Typography'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { BEFORE_SELECT_BOARD_ID } from '@src/static'
import { Component } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickSettings: () => void
    onClickConfirmBoard: () => void
    onClickClose: () => void
    connectionStatus: CONNECTION_STATUS
    appVersion: string
    isActive: boolean
}

const BeforeSelectBoard: Component<IProps> = (props) => {
    return (
        <Modal
            onClickSettings={props.onClickSettings}
            appVersion={props.appVersion}
            connectionStatus={props.connectionStatus}
            id={BEFORE_SELECT_BOARD_ID}
            isActive={props.isActive}
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-14">
                <ModalHeader label="Reminder!" onClick={props.onClickClose} />
                <div class="flex flex-col gap-14">
                    <Typography color="purple" text="h3" class="text-left">
                        Before selecting the board
                    </Typography>
                    <Typography color="white" text="caption" class="text-left leading-[26px]">
                        <code class="code">_Release</code> is meant to be flashed when everything
                        was confirmed working with the regular version first. It has a lot less
                        logging, and debugging features are missing which makes it harder to
                        diagnose what's wrong when issues arise.
                    </Typography>
                </div>
                <Footer
                    onClickPrimaryButton={props.onClickConfirmBoard}
                    onClickSecondaryButton={props.onClickClose}
                    isPrimaryButtonActive={true}
                    primaryButtonLabel="Continue"
                    secondaryButtonLabel="Cancel"
                />
            </div>
        </Modal>
    )
}

export default BeforeSelectBoard
