import { FiMinus, FiPlus } from 'solid-icons/fi'
import { Component } from 'solid-js'
import IconButton from '@components/Buttons/IconButton/Index'

export interface IProps {
    onClickIncrease: () => void
    onClickDecrease: () => void
    value: string
    label: string
}

const Counter: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col w-full gap-[8px]">
            <p class="text-[14px] text-white font-normal leading-[20px] not-italic text-left select-none">
                {props.label}
            </p>
            <div class="flex w-full gap-[8px]">
                <div class="flex items-center ">
                    <IconButton onClick={props.onClickDecrease}>
                        <FiMinus size={24} color="#fff" />
                    </IconButton>
                </div>
                <div class="bg-[#192736] flex justify-center items-center rounded-[8px] w-full min-h-[50px]">
                    <p class="not-italic font-normal text-white leading-[20px] text-[18px] text-center select-none">
                        {props.value ?? '----'}
                    </p>
                </div>
                <div class="flex items-center">
                    <IconButton onClick={props.onClickIncrease}>
                        <FiPlus size={24} color="#fff" />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default Counter
