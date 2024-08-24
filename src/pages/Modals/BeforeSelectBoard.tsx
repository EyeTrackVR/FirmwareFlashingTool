import { Component } from 'solid-js'
import { Footer } from '@components/Footer/Footer'
import { Modal } from '@components/Modal/Index'
import ModalHeader from '@components/ModalHeader/Index'
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
                        <code class="code">_Release</code> Has a lot less debugging, may also be
                        missing some things available only in debug for debug purposes, this should
                        be flashed when everything is working.
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
