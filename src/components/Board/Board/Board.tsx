import { Component, createMemo } from 'solid-js'

export interface IProps {
    onClick: () => void
    board: string
    description: string
    isActive?: boolean
}

export const Board: Component<IProps> = (props) => {
    const styles = createMemo(() => {
        return props.isActive
            ? 'hover:bg-[#9793FD] rounded-[6px] pt-[6px] pb-[6px] pr-[12px] pl-[12px] text-left border border-solid border-[#817DF7] hover:border-[#9793FD] cursor-pointer bg-[#817DF7] focus-visible:border-[#fff]'
            : 'hover:bg-[#192736] rounded-[6px] pt-[6px] pb-[6px] pr-[12px] pl-[12px] text-left  border border-solid border-[#0D1B26] cursor-pointer focus-visible:border-[#9793FD]'
    })

    return (
        <button
            class={styles()}
            onClick={(e) => {
                e.preventDefault()
                props.onClick()
            }}>
            <div class="text-white text-[16px] leading-[20px] font-[500] not-italic">
                <p>{props.board}</p>
            </div>
            <div class="pt-[2px] text-white text-[12px] leading-[20px] font-[500] not-italic max-w-[220px]">
                <p>
                    {props.description.slice(0, 1).toLocaleUpperCase() +
                        props.description.slice(1).toLocaleLowerCase()}
                </p>
            </div>
        </button>
    )
}

export default Board
