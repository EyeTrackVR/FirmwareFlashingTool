import { JSXElement, Show, createEffect, createSignal } from 'solid-js'
import CustomPopover from './CustomPopOver'

export interface IProps {
    onClick: (isButtonActive: boolean) => void
    isButtonActive: boolean
    name?: string
    tooltip?: string
    path?: string
    icon?: JSXElement
}

const CustomButton = (props: IProps) => {
    const [isActive, setIsActive] = createSignal(false)

    const handleOnClick = () => {
        setIsActive(props.isButtonActive)
        props.onClick(isActive())
    }

    createEffect(() => {
        setIsActive(props.isButtonActive)
    })

    return (
        <div
            class={`flex justify-center items-center w-full h-[auto] flex-col ${
                isActive() ? 'bg-[#0071FE]' : 'bg-[#333742]'
            }   ${
                isActive() ? 'hover:bg-[#0065E2]' : 'hover:bg-[#0071FE]'
            } rounded-lg p-2 cursor-pointer m-2`}
            onClick={handleOnClick}>
            <div class="flex justify-center items-center h-full w-full">
                <Show
                    when={props.icon}
                    fallback={
                        <img
                            src={props.path}
                            alt="img"
                            class="h-full m-auto max-w-[57px] max-md:max-w-[40px] max-xl:max-w-[50px]"
                        />
                    }>
                    <Show when={!props.name && props.tooltip} fallback={props.icon}>
                        <CustomPopover
                            styles="h-full m-auto max-w-[57px] max-md:max-w-[40px] max-xl:max-w-[50px]"
                            popoverContent={props.tooltip}
                            icon={props.icon}
                        />
                    </Show>
                </Show>
            </div>
            <Show when={props.name && !props.tooltip}>
                <div class="flex justify-center items-end pt-2 h-full w-full text-white text-xl max-md:text-xs max-lg:text-sm max-xl:text-base">
                    <p>{props.name}</p>
                </div>
            </Show>
        </div>
    )
}
export default CustomButton
