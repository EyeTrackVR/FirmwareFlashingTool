import { Component } from 'solid-js'
import { Footer } from '@components/Footer'
import { Modal } from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { beforeSelectBoardModalID } from '@src/static'
import Typography from '@components/Typography'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickConfirmBoard: () => void
    onClickClose: () => void
    isActive: boolean
}

const BeforeSelectBoard: Component<IProps> = (props) => {
    return (
        <Modal
            id={beforeSelectBoardModalID}
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
                    secondLabel="Cancel"
                    primaryLabel="Continue"
                    styles="!justify-end"
                    onClickPrimary={props.onClickConfirmBoard}
                    onClickSecond={props.onClickClose}
                />
            </div>
        </Modal>
    )
}

export default BeforeSelectBoard
