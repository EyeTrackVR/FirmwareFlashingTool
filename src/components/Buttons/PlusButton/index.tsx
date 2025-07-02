import theme from '@src/common/theme'
import { AiOutlinePlus } from 'solid-icons/ai'
import { Component } from 'solid-js'

export interface IProps {
    onClick: () => void
    disabled?: boolean
}

const PlusButton: Component<IProps> = (props) => {
    return (
        <button
            disabled={props.disabled}
            classList={{
                'cursor-not-allowed': props.disabled,
                'cursor-pointer': !props.disabled,
            }}
            class="flex items-center justify-center bg-black-800 p-6 rounded-6 hover:bg-grey-200 transition duration-[200ms]"
            onClick={() => props.onClick()}>
            <AiOutlinePlus size={24} color={theme.colors.white[100]} />
        </button>
    )
}

export default PlusButton
