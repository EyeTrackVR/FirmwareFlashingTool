import OptionButton from '@components/Buttons/OptionButton'
import { Modal } from '@components/Modal/Modal'
import ModalHeader from '@components/Modal/ModalHeader'
import { CHANNEL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import { DEVTOOLS_MODAL_ID } from '@src/static'
import { Component, For } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    onClickSetChannelMode: (option: string) => void
    isActive: boolean
    version: string
    channelMode: CHANNEL_TYPE
    channelOptions: IDropdownList[]
}

const DevtoolsModal: Component<IProps> = (props) => {
    return (
        <Modal
            version={props.version}
            id={DEVTOOLS_MODAL_ID}
            isActive={props.isActive}
            width="w-[350px]"
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-14 w-full">
                <ModalHeader label="Select release" onClick={props.onClickClose} />
                <div class="flex flex-col gap-12 w-full">
                    <For each={props.channelOptions}>
                        {(data) => (
                            <OptionButton
                                {...data}
                                isActive={data.label === props.channelMode}
                                onClick={() => {
                                    props.onClickSetChannelMode(data.label)
                                }}
                            />
                        )}
                    </For>
                </div>
            </div>
        </Modal>
    )
}

export default DevtoolsModal
