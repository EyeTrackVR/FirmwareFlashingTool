import { DefaultBoard } from '@components/Board/DefaultBoard'
import Typography from '@components/Typography'
import { IDropdownList } from '@interfaces/interfaces'
import { classNames } from '@src/utils'
import { Component, For, Show } from 'solid-js'

export interface IProps {
    onClick: (data: IDropdownList) => void
    ref?: (el: HTMLDivElement) => void
    activeElement: string
    data: IDropdownList[]
    styles?: string
    tabIndex?: number
    fallbackLabel?: string
    isScrollbar?: boolean
    disableTop?: boolean
}

const DropdownList: Component<IProps> = (props) => {
    return (
        <div
            tabIndex={props.tabIndex ?? 0}
            ref={(el) => props.ref?.(el)}
            class={classNames(
                props.styles,
                'dropdown-content right-[-13px] p-12 rounded-12 border border-solid border-black-800 bg-black-900 w-[350px]',
            )}
            style={!props.disableTop ? { top: 'calc(100% + 20px)' } : undefined}>
            <div
                classList={{ ['pr-12 scrollbar']: props.isScrollbar }}
                class={'overflow-y-scroll max-h-[250px] flex flex-col gap-10 w-full'}>
                <Show
                    when={props.data.length}
                    fallback={
                        <div class="flex flex-row gap-12 items-center">
                            <span class="loading loading-ring loading-md" />
                            <Typography color="white" text="caption">
                                {props.fallbackLabel ?? 'Loading...'}
                            </Typography>
                        </div>
                    }>
                    <For each={props.data}>
                        {(data) => (
                            <DefaultBoard
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
