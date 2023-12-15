import { Component, createMemo } from 'solid-js'

export interface IProps {
    type?: 'submit' | 'reset' | 'button' | undefined
    isActive?: boolean
    isError?: boolean
    label: string
    onClick?: () => void
}

export const Button: Component<IProps> = (props) => {
    const styles = createMemo(() => {
        if (typeof props.isActive !== 'undefined') {
            return props.isActive
                ? 'bg-[#817DF7] pr-[32px] pl-[32px] pt-[8px] pb-[8px] rounded-[6px] hover:bg-[#9793FD]'
                : 'bg-[#192736] pr-[32px] pl-[32px] pt-[8px] pb-[8px] rounded-[6px] hover:bg-[#30475e] '
        }

        return props.isError
            ? 'bg-[#817DF7] pr-[32px] pl-[32px] pt-[8px] pb-[8px] rounded-[6px] hover:bg-[#9793FD]'
            : 'bg-[#192736] pr-[32px] pl-[32px] pt-[8px] pb-[8px] rounded-[6px] hover:bg-[#30475e] cursor-not-allowed'
    })

    return (
        <button
            type={props.type}
            class={styles()}
            onClick={(e) => {
                e.preventDefault()
                props.onClick?.()
            }}>
            <p class="text-left text-[14px] text-white font-[700] leading-[20px] not-italic">
                {props.label}
            </p>
        </button>
    )
}

export default Button
