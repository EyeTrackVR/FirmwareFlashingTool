import { Component, Show } from 'solid-js'
import ConnectionStatus from '@components/ConnectionStatus/Index'
import { CONNECTION_STATUS } from '@interfaces/enums'

export interface IProps {
    onClick: () => void
    label: string
    description?: string
    isActive?: boolean
    mode?: CONNECTION_STATUS
}

export const Board: Component<IProps> = (props) => {
    return (
        <button
            classList={{
                'hover:bg-[#9793FD] border-[#817DF7] hover:border-[#9793FD] bg-[#817DF7] focus-visible:border-[#fff]':
                    props.isActive,
                'hover:bg-[#192736] border-[#0D1B26] focus-visible:border-[#9793FD]':
                    !props.isActive,
            }}
            class={
                'rounded-[6px] pt-[6px] pb-[6px] pr-[12px] pl-[12px] text-left  border border-solid cursor-pointer'
            }
            onClick={(e) => {
                e.preventDefault()
                props.onClick()
            }}>
            <div class="flex flex-row items-center gap-[60px]">
                <div>
                    <div class="text-white text-[16px] leading-[20px] font-medium not-italic whitespace-nowrap">
                        <p>{props.label}</p>
                    </div>
                    <Show when={props.description}>
                        <div class="pt-[2px] text-white text-[12px] leading-[20px] font-normal not-italic max-w-[220px]">
                            <p>
                                {(props.description ?? '').slice(0, 1).toLocaleUpperCase() +
                                    (props.description ?? '').slice(1).toLocaleLowerCase()}
                            </p>
                        </div>
                    </Show>
                </div>
                <Show when={typeof props.mode !== 'undefined'}>
                    <ConnectionStatus mode={props.mode ?? CONNECTION_STATUS.UNKNOWN} />
                </Show>
            </div>
        </button>
    )
}

export default Board
