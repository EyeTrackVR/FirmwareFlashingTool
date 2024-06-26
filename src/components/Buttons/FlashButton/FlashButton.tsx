import { Component, JSXElement, Show } from 'solid-js'

export interface IProps {
    label: string
    onClick: () => void
    img: JSXElement
    step?: string
}

export const FlashButton: Component<IProps> = (props) => {
    return (
        <button
            onClick={() => {
                props.onClick()
            }}
            class="card card-actions !outline-none mt-0 shadow-none bg-[#192736] flex flex-col justify-between p-[14px] border-solid border-1 border-[#192736] focus-visible:border-[#817DF7] rounded-[24px] hover:border-[#817DF7] min-h-[210px] h-full max-w-[197px]  w-full ">
            <div class="card-body p-0 flex flex-row justify-between w-full">
                <div>{props.img}</div>
                <Show when={props.step}>
                    <div>
                        <p
                            class="not-italic font-normal text-white leading-[20px] text-[24px] text-left"
                            style={{ color: 'rgba(166, 170, 211, 0.50)' }}>
                            {props.step}
                        </p>
                    </div>
                </Show>
            </div>
            <div>
                <p class="not-italic font-normal text-white leading-[20px]min-[800px] min-[800px]:text-[16px] text-[14px] text-left">
                    {props.label}
                </p>
            </div>
        </button>
    )
}
