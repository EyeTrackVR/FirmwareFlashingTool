import { Component } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { Modal } from '@components/Modal/Index'
import ModalHeader from '@components/ModalHeader/Index'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { wifiModalID } from '@src/static'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    onClick: () => void
    isActive: boolean
}

const WifiModal: Component<IProps> = (props) => {
    return (
        <Modal
            id={wifiModalID}
            isActive={props.isActive}
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-[14px]">
                <ModalHeader label="Wifi" onClick={props.onClickClose} />
                <div class="flex flex-col gap-[14px]">
                    <div>
                        <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                            Important!
                        </p>
                    </div>
                    <div>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                            Before proceeding, you <code class="code">must</code> first restart your
                            board. Simply disconnect it and plug it back in, no buttons need to be
                            held.
                        </p>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic py-[10px]">
                            Once done, press <code class="code">Send Credentials</code> and give it
                            a couple of seconds until it finishes.
                        </p>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                            This should setup your board wifi proper wifi and mdns name, check if it
                            connected!
                        </p>
                    </div>
                </div>
                <div class="flex justify-end gap-[10px]">
                    <Button
                        isLoadingPrimaryButton={false}
                        isActive={false}
                        type={'button'}
                        label="Send credentials"
                        onClick={() => {
                            props.onClick()
                        }}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default WifiModal
