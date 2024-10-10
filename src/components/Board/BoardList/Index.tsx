import { Show, For, Component } from 'solid-js'
import { BoardItem } from '../BoardItem/Index'
import { BoardListHeader } from '../BoardListHeader/Index'
import { EmptyBoardList } from '../EmptyBoardList/Index'
import { IBoardHardware } from '@interfaces/interfaces'

export interface IProps {
    boards: IBoardHardware[]
    onClickOpenDocs: () => void
    onEditBoard: (board: IBoardHardware) => void
    onDeleteBoard: (board: IBoardHardware) => void
}

export const BoardList: Component<IProps> = (props) => {
    return (
        <div class="w-full h-auto">
            <div class="bg-[#0D1B26] h-auto flex flex-col justify-start p-[24px] rounded-[12px] border border-solid border-[#192736] gap-[12px] min-h-[158px]">
                <BoardListHeader
                    boardCount={props.boards.length}
                    onClickOpenDocs={props.onClickOpenDocs}
                />
                <Show when={props.boards.length > 0} fallback={<EmptyBoardList />}>
                    <For each={props.boards}>
                        {(board) => (
                            <BoardItem
                                board={board}
                                onEdit={() => props.onEditBoard(board)}
                                onDelete={() => props.onDeleteBoard(board)}
                            />
                        )}
                    </For>
                </Show>
            </div>
        </div>
    )
}
