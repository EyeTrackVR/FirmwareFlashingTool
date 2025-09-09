import SelectButton from '@components/Buttons/SelectButton'
import Dropdown from '@components/Dropdown/Dropdown'
import DropdownList from '@components/Dropdown/DropdownList'
import { Modal } from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { CHANNEL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import { IEventType } from '@interfaces/types'
import { beforeFlashingModalID, DEVTOOLS_MODAL_ID } from '@src/static'
import { Component } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    onClickSetChannelMode: (option: string) => void
    isActive: boolean
    checked: boolean
    version: string
    channelMode: CHANNEL_TYPE
    channelOptions?: IDropdownList[]
}

const DevtoolsModal: Component<IProps> = (props) => {
    let versionTab: HTMLDivElement | undefined = undefined

    return (
        <Modal
            version={props.version}
            id={DEVTOOLS_MODAL_ID}
            isActive={props.isActive}
            width="w-[350px]"
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-14 w-full">
                <ModalHeader label="Reminder!" onClick={props.onClickClose} />
                <Dropdown
                    onFocusOut={(event: IEventType) => {
                        const isFocusLost =
                            event.relatedTarget instanceof HTMLElement &&
                            event.currentTarget.contains(event.relatedTarget)
                        if (isFocusLost) return

                        if (versionTab) {
                            versionTab.style.opacity = '0'
                            versionTab.style.display = 'none'
                        }
                    }}>
                    <SelectButton
                        header="Firmware channel"
                        tabIndex={1}
                        type="button"
                        onClick={() => {
                            if (versionTab) {
                                versionTab!.style.display = 'block'
                                setTimeout(() => {
                                    versionTab!.style.opacity = '1'
                                }, 25)
                            }
                        }}
                        label={props.channelMode}
                    />
                    <DropdownList
                        ref={(el) => (versionTab = el)}
                        activeElement={props.channelMode}
                        data={props.channelOptions ?? []}
                        tabIndex={1}
                        onClick={(data) => {
                            props.onClickSetChannelMode(data.label)
                        }}
                    />
                </Dropdown>
            </div>
        </Modal>
    )
}

export default DevtoolsModal
