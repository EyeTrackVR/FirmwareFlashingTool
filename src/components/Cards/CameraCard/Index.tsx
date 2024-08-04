import { BsUsbSymbol } from 'solid-icons/bs'
import { FaSolidWifi } from 'solid-icons/fa'
import { Component, Show } from 'solid-js'

export interface IProps {
    isConnected: boolean
    active: boolean
    isUSB: boolean
    port: string
}

const CameraCard: Component<IProps> = (props) => {
    return (
        <div
            class="flex items-center justify-between p-[12px] rounded-[9px] cursor-pointer w-[219px]"
            classList={{
                'bg-[#0D1B26] hover:bg-[#132838] border border-solid border-[#192736]':
                    !props.active,
                'bg-[#192736] border border-solid border-[#192736]': props.active,
            }}>
            <div class="flex gap-[6px] flex-col h-full justify-between  w-[70%]">
                <p class="font-normal text-white leading-[20px] text-[14px] text-left">Left eye</p>
                <div class="flex gap-[4px]">
                    <p class="font-normal text-[#817DF7] leading-[20px] text-[14px] text-left">
                        Port:
                    </p>
                    <p class="font-normal text-white leading-[20px] text-[14px] text-left overflow-hidden whitespace-nowrap text-ellipsis">
                        {props.port}
                    </p>
                </div>
            </div>
            <div class="flex gap-[6px] flex-col items-center h-full justify-between">
                <div
                    class="w-[12px] h-[12px] rounded-full"
                    classList={{
                        'bg-[#E34848]': !props.isConnected,
                        'bg-[#7DBC54]': props.isConnected,
                    }}
                />
                <Show when={props.isUSB} fallback={<FaSolidWifi size={20} fill="white" />}>
                    <BsUsbSymbol size={20} fill="white" />
                </Show>
            </div>
        </div>
    )
}

export default CameraCard
