import Typography from '@components/Typography'
import theme from '@src/common/theme'
import { ADD_BOARD_LIMIT } from '@src/static'
import { ImBooks } from 'solid-icons/im'
import { Component, Show } from 'solid-js'

export interface IProps {
    boardCount: number
    onClickOpenDocs: () => void
}

export const BoardListHeader: Component<IProps> = (props) => (
    <div class="w-full flex justify-between items-center">
        <div class="flex flex-row items items-center gap-12">
            <Show
                when={props.boardCount > 0}
                fallback={
                    <Typography color="white" text="caption">
                        No boards recently added
                    </Typography>
                }>
                <Typography color="white" text="caption">
                    {props.boardCount} / {ADD_BOARD_LIMIT} cameras added
                </Typography>
            </Show>
        </div>
        <ImBooks
            color={theme.colors.blue[100]}
            class="cursor-pointer"
            size={24}
            onClick={() => {
                props.onClickOpenDocs()
            }}
        />
    </div>
)
