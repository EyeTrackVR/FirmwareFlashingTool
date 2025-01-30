import Typography from '@components/Typography'
import { Component } from 'solid-js'

export interface IProps {
    label: string
}

export const DropdownButton: Component<IProps> = (props) => {
    return (
        <button class="bg-black-800 hover:bg-grey-200 border-black-800 focus-visible:border-purple-100 pr-32 pl-32 pt-8 pb-8 rounded-6 border-solid border-1 h-full">
            <Typography color="white" text="caption">
                {props.label}
            </Typography>
        </button>
    )
}

export default DropdownButton
