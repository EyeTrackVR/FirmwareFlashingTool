import Typography from '@components/Typography'
import { Component, Show } from 'solid-js'

export interface IProps {
    type?: 'submit' | 'reset' | 'button' | undefined
    isLoadingPrimaryButton?: boolean
    disabled?: boolean
    size?: string
    isActive?: boolean
    label: string
    isLoader?: boolean
    onClick?: () => void
}

export const Button: Component<IProps> = (props) => {
    return (
        <button
            classList={{
                'cursor-not-allowed': props.disabled,
                [props.size!]: typeof props.size !== 'undefined',
                'bg-black-800 border-black-800 focus-visible:border-purple-200 cursor-wait':
                    props.isLoadingPrimaryButton,
                'bg-purple-200 hover:bg-purple-100 border-black-800 focus-visible:border-white-100':
                    !props.isLoadingPrimaryButton && props.isActive,
                'bg-black-800 hover:bg-grey-200 border-black-800 focus-visible:border-purple-200':
                    !props.isLoadingPrimaryButton && !props.isActive,
            }}
            type={props.type}
            class="pr-32 pl-32 pt-11 pb-11 rounded-6 border-solid border-1"
            onMouseDown={(e) => {
                e.preventDefault()
                props.onClick?.()
            }}>
            <Show
                when={props.isLoader}
                fallback={
                    <Typography color="white" text="caption" nowrap>
                        {props.label}
                    </Typography>
                }>
                <div class="flex justify-center items-center w-[118px]">
                    <span class="loading loading-ring w-16" />
                </div>
            </Show>
        </button>
    )
}

export default Button
