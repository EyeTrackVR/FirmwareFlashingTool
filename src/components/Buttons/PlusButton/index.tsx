import theme from '@src/common/theme'
import { AiOutlinePlus } from 'solid-icons/ai'
import { Component } from 'solid-js'

export interface IProps {
    onClick: () => void
}

const PlusButton: Component<IProps> = (props) => {
    return (
        <button
            class="flex items-center justify-center bg-black-800 p-6 rounded-6 cursor-pointer hover:bg-grey-200 transition duration-[200ms]"
            onClick={() => props.onClick()}>
            <AiOutlinePlus size={24} color={theme.colors.white[100]} />
        </button>
    )
}

export default PlusButton
