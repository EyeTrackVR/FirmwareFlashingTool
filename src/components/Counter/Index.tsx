import { FiMinus, FiPlus } from 'solid-icons/fi'
import { Component } from 'solid-js'
import IconButton from '@components/Buttons/IconButton/Index'
import Slider from '@components/Slider/Index'
export interface IProps {
    onClickIncrease: () => void
    onClickDecrease: () => void
    onInput: (value: string) => void
    value: number
    label: string
    min: number
    max: number
}

const Counter: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col w-full gap-[8px]">
            <p class="text-[14px] text-white font-normal leading-[20px] not-italic text-left select-none">
                {props.label}
            </p>
            <div class="flex w-full gap-[8px]">
                <div class="flex items-center ">
                    <IconButton
                        onClick={() => {
                            if (props.value <= +props.min) return
                            props.onClickDecrease()
                        }}>
                        <FiMinus size={24} color="#fff" />
                    </IconButton>
                </div>
                <Slider
                    value={props.value}
                    onInput={props.onInput}
                    min={props.min}
                    max={props.max}
                />
                <div class="flex items-center">
                    <IconButton
                        onClick={() => {
                            if (props.value >= +props.max) return
                            props.onClickIncrease()
                        }}>
                        <FiPlus size={24} color="#fff" />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default Counter
