import { FiMinus, FiPlus } from 'solid-icons/fi'
import { Component } from 'solid-js'
import IconButton from '@components/Buttons/IconButton/Index'

export interface IProps {
    onClickIncrease: () => void
    onClickDecrease: () => void
    value: string
}

const Counter: Component<IProps> = (props) => {
    return (
        <div class="flex flex-row gap-[8px] w-full py-[8px]">
            <div class="flex items-center">
                <IconButton onClick={props.onClickDecrease}>
                    <FiMinus size={24} color="#fff" />
                </IconButton>
            </div>
            <div class="bg-[#192736] flex justify-center items-center rounded-[8px] p-[12px] w-full min-h-[52px]">
                <p class="not-italic font-normal text-white leading-[20px] text-[18px] text-center">
                    {props.value ?? '----'}
                </p>
            </div>
            <div class="flex items-center">
                <IconButton onClick={props.onClickIncrease}>
                    <FiPlus size={24} color="#fff" />
                </IconButton>
            </div>
        </div>
    )
}

export default Counter
