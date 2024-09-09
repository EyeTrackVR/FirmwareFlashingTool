import { Component } from 'solid-js'
import { CONNECTION_STATUS } from '@interfaces/enums'

export interface IProps {
    mode: CONNECTION_STATUS
}

const ConnectionStatus: Component<IProps> = (props) => {
    return (
        <div
            class="w-[12px] h-[12px] rounded-full"
            classList={{
                'bg-[#92FA81]': props.mode === CONNECTION_STATUS.TRACKING,
                'bg-[#E34848]': props.mode === CONNECTION_STATUS.ERROR,
                'bg-[#7F878D]': props.mode === CONNECTION_STATUS.UNKNOWN,
            }}
        />
    )
}

export default ConnectionStatus
