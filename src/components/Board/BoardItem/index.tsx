import Typography from '@components/Typography'
import { IBoard } from '@interfaces/boards/interfaces'
import theme from '@src/common/theme'
import { shortAddress } from '@src/utils'
import { FaRegularTrashCan } from 'solid-icons/fa'
import { FiEdit2 } from 'solid-icons/fi'
import { Component } from 'solid-js'

export interface IProps {
    board: IBoard
    onClickEdit: () => void
    onClickDelete: () => void
}

export const BoardItem: Component<IProps> = (props) => (
    <div class="rounded-14 flex justify-between items-center">
        <div class="flex flex-col gap-6 text-left">
            <Typography color="white" text="body">
                {props.board.label}
            </Typography>
            <Typography color="grey" text="caption">
                ({shortAddress(props.board.address, 12)})
            </Typography>
        </div>
        <div class="flex flex-row gap-12 items-center justify-center">
            <FiEdit2
                class="group-hover:fill-white-100 cursor-pointer"
                fill={theme.colors.white[100]}
                size={18}
                onClick={() => {
                    props.onClickEdit()
                }}
            />
            <FaRegularTrashCan
                fill={theme.colors.red[200]}
                class="cursor-pointer"
                size={18}
                onClick={() => {
                    props.onClickDelete()
                }}
            />
        </div>
    </div>
)
