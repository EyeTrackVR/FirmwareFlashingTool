import { Component } from 'solid-js'

export interface IProps {
    label: string
}

export const DropdownButton: Component<IProps> = (props) => {
    return (
        <button class="bg-[#192736] hover:bg-[#30475e] border-[#192736] focus-visible:border-[#817DF7] pr-[32px] pl-[32px] pt-[8px] pb-[8px] rounded-[6px] border-solid border-1">
            <p class="text-[14px] text-white font-normal leading-[20px] not-italic whitespace-nowrap text-center">
                {props.label}
            </p>
        </button>
    )
}

export default DropdownButton
