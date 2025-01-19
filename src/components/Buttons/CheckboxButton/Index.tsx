import { Component } from 'solid-js'
import Checkbox from '@components/Checkbox'

export interface IProps {
    onClick: () => void
    checked: boolean
    label: string
}

const CheckboxButton: Component<IProps> = (props) => {
    return (
        <div
            class="flex flex-row justify-center items-center gap-[6px] cursor-pointer"
            onClick={() => {
                props.onClick()
            }}>
            <Checkbox checked={props.checked} />
            <p class="text-left text-[14px] text-[#9793FD] font-normal leading-[26px] not-italic">
                Don’t show this again
            </p>
        </div>
    )
}

export default CheckboxButton
