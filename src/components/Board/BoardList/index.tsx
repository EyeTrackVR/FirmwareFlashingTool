import { Show, For, Component } from 'solid-js'
import { BoardListHeader } from '../BoardListHeader'
import { BoardItem } from '../BoardItem'
import { IBoard } from '@interfaces/boards/interfaces'

export interface IProps {
    boards: IBoard[]
    onClickOpenDocs: () => void
    onEditBoard: (board: IBoard) => void
    onDeleteBoard: (board: IBoard) => void
}

export const BoardList: Component<IProps> = (props) => {
    return (
        <div class="w-full h-auto flex flex-col gap-12">
            <BoardListHeader
                boardCount={props.boards.length}
                onClickOpenDocs={props.onClickOpenDocs}
            />
            <div class="bg-black-900 h-auto flex flex-col justify-start p-24 rounded-12 border border-solid border-black-800 gap-12 min-h-[100px]">
                <Show when={props.boards.length > 0}>
                    <For each={props.boards}>
                        {(board) => (
                            <BoardItem
                                board={board}
                                onClickEdit={() => props.onEditBoard(board)}
                                onClickDelete={() => props.onDeleteBoard(board)}
                            />
                        )}
                    </For>
                </Show>
            </div>
        </div>
    )
}
