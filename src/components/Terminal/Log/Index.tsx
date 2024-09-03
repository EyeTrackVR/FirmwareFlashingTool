import { Component } from 'solid-js'
import { AP_IP_ADDRESS, SSID_MISSING, STREAM_IS_UNDER } from '@src/static'

export interface IProps {
    message: string
}

const Log: Component<IProps> = (props) => {
    return (
        <div class="flex flex-row gap-[12px] w-full relative">
            <div
                class="w-full flex"
                classList={{
                    'bg-[#16212E] rounded-[4px] whitespace-nowrap':
                        props.message.includes(STREAM_IS_UNDER) ||
                        props.message.includes(AP_IP_ADDRESS),
                    'bg-[#2E1626] rounded-[4px] whitespace-nowrap':
                        props.message.includes(SSID_MISSING),
                }}>
                <pre
                    class="text-left"
                    classList={{
                        'text-[#a8b1ff] bg-[#16212E] rounded-[4px] p-[6px] !whitespace-normal':
                            props.message.includes(STREAM_IS_UNDER) ||
                            props.message.includes(AP_IP_ADDRESS),
                        'bg-[#2E1626] rounded-[4px] p-[6px] !whitespace-normal':
                            props.message.includes(SSID_MISSING),
                    }}>
                    {props.message}
                </pre>
            </div>
        </div>
    )
}

export default Log
