import { type IconTypes } from 'solid-icons'
import { ParentComponent, Show } from 'solid-js'

export interface IProps {
    header: string
    description?: string
    HeaderIcon: IconTypes
}

const Wrapper: ParentComponent<IProps> = (props) => {
    return (
        <div class="w-full bg-[#0D1B26] p-[24px] rounded-[12px] flex flex-col gap-[14px] border border-solid border-[#192736]">
            <div class="flex items-center justify-start gap-[12px]">
                <div class="p-[10px] bg-[#9092FF] rounded-[9px]">
                    <props.HeaderIcon size={20} color="#fff" />
                </div>
                <p class="text-[16px] font-normal text-white leading-[16px] not-italic text-left select-none break-all">
                    {props.header}
                </p>
            </div>
            <Show when={props.description}>
                <div>
                    <p class="text-[14px] text-white font-normal leading-[20px] not-italic text-left select-none">
                        {props.description}
                    </p>
                </div>
            </Show>
            <div>{props.children}</div>
        </div>
    )
}

export default Wrapper
