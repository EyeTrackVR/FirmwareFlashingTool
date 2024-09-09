import { RiArrowsArrowDropDownLine } from 'solid-icons/ri'
import { Component, Show } from 'solid-js'
import ConnectionStatus from '@components/ConnectionStatus/Index'
import { CONNECTION_STATUS } from '@interfaces/enums'
import { classNames } from '@src/utils'

export interface IProps {
    connectionStatus?: CONNECTION_STATUS
    type?: 'submit' | 'reset' | 'button' | undefined
    label: string
    onClick?: () => void
    tabIndex?: number
    header?: string
    rotate?: boolean
    styles?: string
}

export const SelectButton: Component<IProps> = (props) => {
    return (
        <div class="w-full">
            <div class="flex flex-col gap-[14px]">
                <div class=" w-full flex flex-col gap-[8px]">
                    <Show when={props.header}>
                        <div>
                            <p class="text-left text-[14px] text-white font-normal leading-[20px] not-italic">
                                {props.header}
                            </p>
                        </div>
                    </Show>
                    <div>
                        <button
                            tabIndex={props.tabIndex}
                            type={props.type}
                            class={classNames(
                                props.styles,
                                'flex flex-row items-center justify-start gap-[30px] pl-[12px] pr-[12px] h-[39px] bg-[#192736] w-full rounded-[6px] border-solid border-1 border-[#192736] focus:border-817DF7 focus-visible:border-[#9793FD] hover:border-[#817DF7] cursor-pointer',
                            )}
                            onClick={(e) => {
                                e.preventDefault()
                                if (props.onClick) {
                                    props.onClick?.()
                                }
                            }}>
                            <div class="flex flex-row items-center ">
                                <Show when={typeof props.rotate !== 'undefined'}>
                                    <RiArrowsArrowDropDownLine
                                        size={24}
                                        classList={{
                                            'transorm rotate-180': props.rotate,
                                            'transorm rotate-0': !props.rotate,
                                        }}
                                    />
                                </Show>
                                <p class="text-left text-white text-[14px] font-normal leading-[20px] not-italic whitespace-nowrap ">
                                    {props.label}
                                </p>
                            </div>
                            <Show when={typeof props.connectionStatus !== 'undefined'}>
                                <ConnectionStatus mode={CONNECTION_STATUS.TRACKING} />
                            </Show>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectButton
