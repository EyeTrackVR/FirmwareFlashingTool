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
    tabIndex?: number
}

export const DropdownButton: Component<IProps> = (props) => {
    return (
        <summary class="btn m-1" tabIndex={props.tabIndex}>
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
        </summary>
    )
}

export default DropdownButton
