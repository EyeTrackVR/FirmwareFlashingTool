import { Component, Show } from 'solid-js'
import { QuestionMarkModal } from '../QuestionMarkModal/QuestionMarkModal'

export interface IProps {
    onClick: () => void
    isOpen: boolean
}

export const QuestionMark: Component<IProps> = (props) => {
    return (
        <div>
            <button
                class=" ml-auto flex items-center justify-center leadu w-[35px] h-[35px] rounded-full border border-solid border-[#192736] bg-[#0D1B26] cursor-pointer focus-visible:border-[#9793FD]"
                onClick={(e) => {
                    e.preventDefault()
                    props.onClick()
                }}>
                <p class="text-white leading-[12px]">?</p>
            </button>
            <Show when={props.isOpen}>
                <QuestionMarkModal
                    onClick={() => {
                        props.onClick()
                    }}
                />
            </Show>
        </div>
    )
}

export default QuestionMark
