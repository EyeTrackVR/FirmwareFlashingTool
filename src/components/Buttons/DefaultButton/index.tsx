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
            <Show
                when={props.isLoader}
                fallback={
                    <p class="text-[14px] text-white font-normal leading-[20px] not-italic whitespace-nowrap text-center">
                        {props.label}
                    </p>
                }>
                <div class="flex justify-center items-center w-[114px]">
                    <span class="loading loading-ring loading-sm " />
                </div>
            </Show>
        </button>
    )
}

export default Button
