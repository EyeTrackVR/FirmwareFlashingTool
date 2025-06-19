import Typography from '@components/Typography'
import { Component } from 'solid-js'

export interface IProps {
    onClick: () => void
    label: string
    isActive: boolean
}

const MenuItem: Component<IProps> = (props) => {
    return (
        <div
            classList={{ 'bg-grey-300 focus-visible:border-white-100': props.isActive }}
            class="pl-20 cursor-pointer hover:bg-grey-300 py-8 rounded-6"
            onClick={() => props.onClick()}>
            <Typography color="white" text="caption" class="text-left">
                {props.label}
            </Typography>
        </div>
    )
}

export default MenuItem
