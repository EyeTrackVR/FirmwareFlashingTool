import { clsx } from 'clsx'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    type?: 'submit' | 'reset' | 'button' | undefined
    isLoadingPrimaryButton?: boolean
    isActive?: boolean
    label: string
    onClick?: () => void
}

export const Button: Component<IProps> = (props) => {
    const styles = createMemo(() => {
        if (props.isLoadingPrimaryButton) {
            return 'bg-[#192736] border-[#192736] focus-visible:border-[#817DF7] cursor-wait'
        }
        if (typeof props.isActive !== 'undefined') {
            return props.isActive
                ? 'bg-[#817DF7] hover:bg-[#9793FD] border-[#192736] focus-visible:border-[#fff]'
                : 'bg-[#192736] hover:bg-[#30475e] border-[#192736] focus-visible:border-[#817DF7]'
        }
        return 'bg-[#192736] hover:bg-[#30475e] border-[#192736] focus-visible:border-[#817DF7]'
    })

    return (
        <button
            type={props.type}
            class={clsx(
                'pr-[32px] pl-[32px] pt-[8px] pb-[8px] rounded-[6px] border-solid border-1',
                styles(),
            )}
            onClick={(e) => {
                e.preventDefault()
                props.onClick?.()
            }}>
            <p class="text-left text-[14px] text-white font-normal leading-[20px] not-italic whitespace-nowrap">
                {props.label}
            </p>
        </button>
    )
}

export default Button
