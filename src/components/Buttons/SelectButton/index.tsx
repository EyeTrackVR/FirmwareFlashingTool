import { Component } from 'solid-js'

export interface IProps {
    type?: 'submit' | 'reset' | 'button' | undefined
    label: string
    onClick?: () => void
    tabIndex?: number
    header: string
}

export const SelectButton: Component<IProps> = (props) => {
    return (
        <div class="w-full">
            <div class="flex flex-col gap-[14px]">
                <div class=" w-full flex flex-col gap-[8px]">
                    <div>
                        <p class="text-left text-[14px] text-white font-normal leading-[20px] not-italic">
                            {props.header}
                        </p>
                    </div>
                    <div>
                        <button
                            tabIndex={props.tabIndex}
                            type={props.type}
                            class="pl-[12px] pr-[12px] h-[39px] bg-[#192736] w-full rounded-[6px] border-solid border-1 border-[#192736] focus:border-817DF7 focus-visible:border-[#9793FD] hover:border-[#817DF7] cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault()
                                props.onClick?.()
                            }}>
                            <p class="text-left text-white text-[12px] font-normal leading-[20px] not-italic">
                                {props.label}
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectButton
