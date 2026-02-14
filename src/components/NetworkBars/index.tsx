import { Component, createMemo, For } from 'solid-js'

export interface IProps {
    signalBar: number
}

const NetworkBars: Component<IProps> = (props) => {
    return (
        <div class="flex items-end gap-2">
            <For each={new Array(5).fill(0)}>
                {(_, index) => {
                    const isActive = createMemo(() => index() < props.signalBar)
                    return (
                        <div
                            class="w-[4px] rounded-sm transition-colors duration-200 rounded-[1px]"
                            classList={{
                                'bg-green-200': isActive(),
                                'bg-grey-200': !isActive(),
                            }}
                            style={{
                                height: `${(index() + 4) * 2}px`,
                            }}
                        />
                    )
                }}
            </For>
        </div>
    )
}

export default NetworkBars
