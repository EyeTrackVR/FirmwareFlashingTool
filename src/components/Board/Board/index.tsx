import Typography from '@components/Typography'
import { Component, Show } from 'solid-js'

export interface IProps {
    onClick: () => void
    label: string
    description?: string
    isActive?: boolean
}

export const Board: Component<IProps> = (props) => {
    return (
        <button
            classList={{
                'hover:bg-purple-100 border-purple-200 hover:border-purple-100 bg-purple-200 focus-visible:border-white-100':
                    props.isActive,
                'hover:bg-black-800 border-black-900 focus-visible:border-purple-100':
                    !props.isActive,
            }}
            class="rounded-6 pt-6 pb-6 pr-12 pl-12 text-left border border-solid cursor-pointer"
            onClick={(e) => {
                e.preventDefault()
                props.onClick()
            }}>
            <Typography color="white" text="body">
                {props.label}
            </Typography>
            <Show when={props.description}>
                <Typography color="white" text="small" class="leading-[20px] pt-2">
                    {props.description}
                </Typography>
            </Show>
        </button>
    )
}

export default Board
