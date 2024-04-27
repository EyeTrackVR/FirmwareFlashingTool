import { Component, JSXElement, Show } from 'solid-js'

export interface IProps {
    step?: string
    icon: JSXElement
    description: string
}

export const SettingsButton: Component<IProps> = (props) => {
    return (
        <div class="cursor-pointer flex flex-col justify-between max-w-[198px] w-full bg-[#192736] min-h-[210px] h-full rounded-[24px] p-[14px] ">
            <div class="flex flex-row justify-between ">
                <div>{props.icon}</div>
                <Show when={props.step}>
                    <div>
                        <p
                            class="text-[24px] font-medium"
                            style={{ color: 'rgba(255, 255, 255, 0.50)' }}>
                            {props.step}
                        </p>
                    </div>
                </Show>
            </div>
            <div>
                <p class="text-white text-[17px] font-[200] text-left">{props.description}</p>
            </div>
        </div>
    )
}
