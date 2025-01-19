import { Component } from 'solid-js'
import { Footer } from '@components/Footer'
import { Modal } from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { beforeSelectBoardModalID } from '@src/static'

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
            <div class="flex flex-col gap-[14px]">
                <ModalHeader label="Reminder!" onClick={props.onClickClose} />
                <div class="flex flex-col gap-[14px]">
                    <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                        Before selecting the board
                    </p>
                    <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                        <code class="code">_Release</code> is meant to be flashed when everything
                        was confirmed working with the regular version first. It has a lot less
                        logging, and debugging features are missing which makes it harder to
                        diagnose what's wrong when issues arise.
                    </p>
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
