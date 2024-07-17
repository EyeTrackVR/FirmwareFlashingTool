import { Component } from 'solid-js'

export interface IProps {
    version: string
}

const Firmware: Component<IProps> = (props) => {
    return (
        <div class="flex w-full flex-col gap-[6px] select-none">
            <p class="text-left not-italic font-[500] text-white leading-[14px] text-[16px]">
                {props.version}
            </p>
        </div>
    )
}

export default Firmware
