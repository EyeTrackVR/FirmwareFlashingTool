import { Component, For, Show } from 'solid-js'
import { Board } from '@components/Board/Board/Board'
import { IDropdownList } from '@interfaces/interfaces'
export interface IProps {
    onClick: (data: IDropdownList) => void
    ref?: (el: HTMLDivElement) => void
    activeElement?: string
    data: IDropdownList[]
    styles?: string
    tabIndex?: number
    fallbackLabel?: string
    isScrollbar?: boolean
    disableTop?: boolean
    disableStyles?: boolean
}

const DropdownList: Component<IProps> = (props) => {
    return (
        <div
            tabIndex={props.tabIndex ?? 0}
            ref={(el) => props.ref?.(el)}
            classList={{
                'dropdown-content right-[-13px] p-[12px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26] w-[350px]':
                    !props.disableStyles,
            }}
            class={props.styles}
            style={!props.disableTop ? { top: 'calc(100% + 20px)' } : undefined}>
            <div
                classList={{ ['pr-[12px] scrollbar']: props.isScrollbar }}
                class={'overflow-y-scroll max-h-[250px] flex flex-col gap-[6px] w-full'}>
                <Show
                    when={props.data.length}
                    fallback={
                        <div class="flex flex-row gap-[6px] items-center">
                            <span class="loading loading-ring loading-md" />
                            <p>{props.fallbackLabel ?? 'Loading...'}</p>
                        </div>
                    }>
                    <For each={props.data}>
                        {(data) => {
                            return (
                                <Board
                                    {...data}
                                    isActive={
                                        data?.hardwareType
                                            ? data.hardwareType === props?.activeElement
                                            : data.label === props?.activeElement
                                    }
                                    onClick={() => {
                                        props.onClick(data)
                                    }}
                                />
                            )
                        }}
                    </For>
                </Show>
            </div>
        </div>
    )
}

export default DropdownList
