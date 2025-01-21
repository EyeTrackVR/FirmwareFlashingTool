import Typography from '@components/Typography'
import { Component } from 'solid-js'

export interface IProps {
    type?: 'submit' | 'reset' | 'button' | undefined
    label: string
    onClick?: () => void
    tabIndex?: number
    header: string
}

export const SelectButton: Component<IProps> = (props) => {
    return (
        <div class="w-full flex flex-col gap-8">
            <Typography color="white" text="caption" class="text-left">
                {props.header}
            </Typography>
            <button
                tabIndex={props.tabIndex}
                type={props.type}
                class="pl-12 pr-12 py-12 bg-black-800 w-full rounded-6 border-solid border-1 border-black-800 focus-visible:border-purple-100 hover:border-purple-200 cursor-pointer"
                onClick={(e) => {
                    e.preventDefault()
                    props.onClick?.()
                }}>
                <Typography color="white" text="small" class="text-left">
                    {props.label}
                </Typography>
            </button>
        </div>
    )
}

export default SelectButton
