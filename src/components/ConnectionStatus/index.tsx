import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { classNames } from '@src/utils'
import { Component, createMemo } from 'solid-js'

export interface IProps {
    status: CONNECTION_STATUS
}

const ConnectionStatus: Component<IProps> = (props) => {
    const color = createMemo(() => {
        switch (props.status) {
            case CONNECTION_STATUS.CONNECTED:
                return 'bg-green-200'
            case CONNECTION_STATUS.DISCONNECTED:
                return 'bg-red-100'
            case CONNECTION_STATUS.DISCONNECTING:
                return 'bg-red-100'
            case CONNECTION_STATUS.CONNECTING:
                return 'bg-yellow-100'
            case CONNECTION_STATUS.IN_ACTIVE:
                return 'bg-grey-100'
            default:
                return 'bg-grey-100'
        }
    })

    return <div class={classNames('w-14 h-14 rounded-100', color())} />
}

export default ConnectionStatus
