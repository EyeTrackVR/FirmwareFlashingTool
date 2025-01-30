import Checkbox from '@components/Checkbox'
import Typography from '@components/Typography'
import { Component } from 'solid-js'

export interface IProps {
    onClick: () => void
    checked: boolean
    label: string
}

const CheckboxButton: Component<IProps> = (props) => {
    return (
        <div
            class="flex flex-row justify-center items-center gap-6 cursor-pointer"
            onClick={() => {
                props.onClick()
            }}>
            <Checkbox checked={props.checked} />
            <Typography color="purple" text="caption" class="leading-[17px]">
                Don’t show this again
            </Typography>
        </div>
    )
}

export default CheckboxButton
