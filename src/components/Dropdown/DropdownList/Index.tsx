import { Component, For, Show } from 'solid-js'
import { Board } from '@components/Board/Board/Board'
import { IDropdownList } from '@interfaces/interfaces'
import { classNames } from '@src/utils'
export interface IProps {
    onClick: (data: IDropdownList) => void
    ref?: (el: HTMLDivElement) => void
    activeElement: string
    data: IDropdownList[]
    styles?: string
    tabIndex?: number
    fallbackLabel?: string
    isScrollbar?: boolean
}

const DropdownList: Component<IProps> = (props) => {
    return (
        <div
            tabIndex={props.tabIndex ?? 0}
            ref={(el) => props.ref?.(el)}
            class={classNames(
                props.styles,
                'dropdown-content right-[-13px] p-[12px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26] w-[350px]',
            )}
            style={{ top: 'calc(100% + 20px)' }}>
            <div
                classList={{ ['pr-[12px] scrollbar']: props.isScrollbar }}
                class={'overflow-y-scroll max-h-[250px] flex flex-col gap-[10px] w-full'}>
                <Show
                    when={props.data.length}
                    fallback={
                        <div class="flex flex-row gap-[6px]">
                            <span class="loading loading-ring loading-md" />
                            <p>{props.fallbackLabel ?? 'Loading...'}</p>
                        </div>
                    }>
                    <For each={props.data}>
                        {(data) => (
                            <Board
                                {...data}
                                isActive={data.label === props.activeElement}
                                onClick={() => {
                                    props.onClick(data)
                                }}
                            />
                        )}
                    </For>
                </Show>
            </div>
        </div>
    )
}

export default DropdownList
