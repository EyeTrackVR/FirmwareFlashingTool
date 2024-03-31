import { Component, JSXElement, Show } from 'solid-js'

declare module 'solid-js' {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            'esp-web-install-button': any // replace any with the type of props
        }
    }
}

export interface IProps {
    label: string
    img: JSXElement
    step?: string
    manifest: string
    checkSameFirmware: (manifest: { name: string }, improvInfo: { firmware: string }) => void
    onClickESPButton:()=>void
}

export const EspWebButton: Component<IProps> = (props) => {
    return (
        <esp-web-install-button overrides={props.checkSameFirmware} manifest={props.manifest} onClick ={()=>{
            props.onClickESPButton()
        }}>
            <button
                slot="activate"
                class="card card-actions !outline-none mt-0 shadow-none bg-[#192736] flex flex-col justify-between p-[14px] border-solid border-1 focus-visible:border-[#817DF7] border-[#192736] rounded-[24px] hover:border-[#817DF7] min-h-[210px] h-full max-w-[197px]  w-full ">
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
            <button
                slot="unsupported"
                disabled
                class="card card-actions !outline-none mt-0 shadow-none bg-[#000F1A] flex flex-col justify-between p-[14px] border-solid border-2 border-[#192736] rounded-[24px] cursor-not-allowed  min-h-[210px] h-full max-w-[197px]  w-full ">
                <div class="card-body p-0 flex flex-row justify-between w-full">
                    <div>{props.img}</div>
                </div>
                <div>
                    <p class="not-italic font-normal text-white leading-[20px]min-[800px] min-[800px]:text-[16px] text-[14px] text-left">
                        Ah snap, your browser doesn't work!
                    </p>
                </div>
            </button>
            <button
                slot="not-allowed"
                disabled
                class="card card-actions !outline-none mt-0 shadow-none bg-[#000F1A] flex flex-col justify-between p-[14px] border-solid border-2 border-[#192736] rounded-[24px] cursor-not-allowed  min-h-[210px] h-full max-w-[197px]  w-full ">
                <div class="card-body p-0 flex flex-row justify-between w-full">
                    <div>{props.img}</div>
                </div>
                <div>
                    <p class="not-italic font-normal text-white leading-[20px]min-[800px] min-[800px]:text-[16px] text-[14px] text-left">
                        Ah snap, you are not allowed to use this on HTTP!
                    </p>
                </div>
            </button>
        </esp-web-install-button>
    )
}
