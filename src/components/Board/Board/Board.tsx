import { clsx } from 'clsx'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    onClick: () => void
    board: string
    description?: string
    isActive?: boolean
}

export const Board: Component<IProps> = (props) => {
    const hover = createMemo(() => {
        return props.isActive
            ? 'hover:bg-[#9793FD] border-[#817DF7] hover:border-[#9793FD] bg-[#817DF7] focus-visible:border-[#fff]'
            : 'hover:bg-[#192736] border-[#0D1B26] focus-visible:border-[#9793FD]'
    })

    return (
        <button
            class={clsx(
                'rounded-[6px] pt-[6px] pb-[6px] pr-[12px] pl-[12px] text-left  border border-solid cursor-pointer',
                hover(),
            )}
            onClick={(e) => {
                e.preventDefault()
                props.onClick()
            }}>
            <div class="text-white text-[16px] leading-[20px] font-medium not-italic">
                <p>{props.board}</p>
            </div>
            {props.description ? (
                <div class="pt-[2px] text-white text-[12px] leading-[20px] font-normal not-italic max-w-[220px]">
                    <p>
                        {props.description.slice(0, 1).toLocaleUpperCase() +
                            props.description.slice(1).toLocaleLowerCase()}
                    </p>
                </div>
            ) : undefined}
        </button>
    )
}

export default Board
