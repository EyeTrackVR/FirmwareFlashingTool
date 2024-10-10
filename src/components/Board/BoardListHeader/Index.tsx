import { AiFillCamera } from 'solid-icons/ai'
import { ImBooks } from 'solid-icons/im'
import { Component, Show } from 'solid-js'
import { ADD_BOARD_LIMIT } from '@src/static'

export interface IProps {
    boardCount: number
    onClickOpenDocs: () => void
}

export const BoardListHeader: Component<IProps> = (props) => (
    <div class="w-full flex justify-between">
        <div class="flex flex-row gap-[12px]">
            <AiFillCamera size={24} color="#fff" />
            <Show
                when={props.boardCount > 0}
                fallback={
                    <p class="not-italic text-white text-[16px] text-start select-none">
                        Nothing to show.
                    </p>
                }>
                <p class="not-italic text-white text-[16px] text-start select-none">
                    {props.boardCount} / {ADD_BOARD_LIMIT} cameras added
                </p>
            </Show>
        </div>
        <div
            class="cursor-pointer"
            onClick={() => {
                props.onClickOpenDocs()
            }}>
            <ImBooks size={24} color="#4F6B87" />
        </div>
    </div>
)
