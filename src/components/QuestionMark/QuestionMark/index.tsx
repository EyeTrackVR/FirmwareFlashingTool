import { type Component } from 'solid-js'
import { QuestionMarkModal } from '../QuestionMarkModal/QuestionMarkModal'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { QUESTION_MODAL_ID } from '@src/static'
import { type TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickOpenModal: (id: string) => void
}

export const QuestionMark: Component<IProps> = (props) => {
    return (
        <div>
            <button
                class="ml-auto flex items-center justify-center leadu w-[35px] h-[35px] rounded-full border border-solid border-[#192736] bg-[#0D1B26] cursor-pointer focus-visible:border-[#9793FD]"
                onClick={(e) => {
                    e.preventDefault()
                    props.onClickOpenModal(QUESTION_MODAL_ID)
                }}>
                <p class="text-white leading-[12px]">?</p>
            </button>
            <dialog id={QUESTION_MODAL_ID} class="modal">
                <Titlebar onClickHeader={props.onClickHeader} />
                <div class="modal-box w-auto h-auto p-[10px] bg-transparent ">
                    <QuestionMarkModal />
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button class="cursor-default">close</button>
                </form>
            </dialog>
        </div>
    )
}

export default QuestionMark
