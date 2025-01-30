import Typography from '@components/Typography'
import theme from '@src/common/theme'
import { FaSolidXmark } from 'solid-icons/fa'
import { type Component } from 'solid-js'

export interface IProps {
    onClick?: () => void
    disabled?: boolean
    label: string
}

const ModalHeader: Component<IProps> = (props) => {
    return (
        <div class="flex justify-between items-center">
            <Typography color="white" text="body" class="text-left">
                {props.label}
            </Typography>
            <div
                class="modal-action mt-0"
                onClick={() => {
                    props.onClick?.()
                }}>
                <form method="dialog" class="flex">
                    <button
                        class="cursor-pointer rounded-100 border border-solid border-black-900 focus-visible:border-purple-200"
                        disabled={props.disabled}>
                        <FaSolidXmark size={20} fill={theme.colors.white[100]} />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ModalHeader
