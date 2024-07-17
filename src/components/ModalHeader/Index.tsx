import { FaSolidXmark } from 'solid-icons/fa'
import { type Component } from 'solid-js'

export interface IProps {
    label: string
    onClick?: () => void
}

const ModalHeader: Component<IProps> = (props) => {
    return (
        <div class="flex justify-between">
            <div>
                <p class="text-left text-[18px] text-white font-medium leading-[20px] not-italic">
                    {props.label}
                </p>
            </div>
            <div
                class="modal-action mt-0"
                onClick={() => {
                    props.onClick?.()
                }}>
                <form method="dialog">
                    <button class="cursor-pointer p-[4px] rounded-full border border-solid border-[#0D1B26] focus-visible:border-[#9793FD]">
                        <p class="text-white text-left">
                            <FaSolidXmark size={20} fill="#FFFFFF" />
                        </p>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ModalHeader
