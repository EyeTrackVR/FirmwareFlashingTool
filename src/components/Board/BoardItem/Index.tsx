import { FaRegularTrashCan } from 'solid-icons/fa'
import { FiEdit2 } from 'solid-icons/fi'
import { Component } from 'solid-js'
import { IBoard } from '@interfaces/interfaces'
import { shortAddress } from '@src/utils'

export interface IProps {
    board: IBoard
    onEdit: () => void
    onDelete: () => void
}

export const BoardItem: Component<IProps> = (props) => (
    <div class="p-[12px] bg-[#0D1B26] border border-solid border-[#0D1B26] rounded-[14px] flex justify-between items-center">
        <div class="flex flex-col gap-[6px]">
            <p class="not-italic font-medium text-[#EEF5FF] text-[16px] text-start select-none tracking-[0.02em]">
                {props.board.label}
            </p>
            <p class="not-italic text-white text-[14px] text-start select-none tracking-[0.02em]">
                ({shortAddress(props.board.address, 12)})
            </p>
        </div>
        <div class="flex flex-row gap-[4px]">
            <div
                class="cursor-pointer p-[8px]"
                onClick={() => {
                    props.onEdit()
                }}>
                <FiEdit2 size={18} fill="#fff" class="group-hover:fill-[#fff]" />
            </div>
            <div
                class="cursor-pointer p-[8px]"
                onClick={() => {
                    props.onDelete()
                }}>
                <FaRegularTrashCan size={18} fill="#FB7D89" />
            </div>
        </div>
    </div>
)
