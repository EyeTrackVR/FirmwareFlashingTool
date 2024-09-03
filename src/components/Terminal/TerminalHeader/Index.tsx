import { ImBooks } from 'solid-icons/im'
import { TbTerminal2 } from 'solid-icons/tb'
import { Component } from 'solid-js'

export interface IProps {
    onClickOpenDocs: () => void
}

const TerminalHeader: Component<IProps> = (props) => {
    return (
        <div class="flex justify-between">
            <div class="flex gap-[12px] justify-center items-center">
                <TbTerminal2 size={24} color="#fff" />
                <p class="not-italic font-[500] text-white leading-[12px] text-[20px] text-center select-none">
                    Serial Terminal
                </p>
            </div>
            <div
                class="cursor-pointer"
                onClick={() => {
                    props.onClickOpenDocs()
                }}>
                <ImBooks size={24} color="#4F6B87" />
            </div>
        </div>
    )
}

export default TerminalHeader
