import { Component } from 'solid-js'

export interface IProps {
    type?: 'submit' | 'reset' | 'button' | undefined
    isLoadingPrimaryButton?: boolean
    disabled?: boolean
    size?: string
    isActive?: boolean
    label: string
    onClick?: () => void
}

export const Button: Component<IProps> = (props) => {
    return (
        <button
            classList={{
                'cursor-not-allowed': props.disabled,
                [props.size!]: typeof props.size !== 'undefined',
                'bg-[#192736] border-[#192736] focus-visible:border-[#817DF7] cursor-wait':
                    props.isLoadingPrimaryButton,
                'bg-[#817DF7] hover:bg-[#9793FD] border-[#192736] focus-visible:border-[#fff]':
                    !props.isLoadingPrimaryButton && props.isActive,
                'bg-[#192736] hover:bg-[#30475e] border-[#192736] focus-visible:border-[#817DF7]':
                    !props.isLoadingPrimaryButton && !props.isActive,
            }}
            type={props.type}
            class={'pr-[32px] pl-[32px] pt-[8px] pb-[8px] rounded-[6px] border-solid border-1'}
            onMouseDown={(e) => {
                e.preventDefault()
                props.onClick?.()
            }}>
            <p class="text-center text-[14px] text-white font-normal leading-[20px] not-italic whitespace-nowrap">
                {props.label}
            </p>
        </button>
    )
}

export default Button
