import { Component } from 'solid-js'
import { Button } from '@components/Buttons/Button'
import { Modal } from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { wifiModalID } from '@src/static'
import Typography from '@components/Typography'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    onClick: () => void
    isActive: boolean
    isSending: boolean
}

const WifiModal: Component<IProps> = (props) => {
    return (
        <Modal
            id={wifiModalID}
            isSending={props.isSending}
            isActive={props.isActive}
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-14">
                <ModalHeader label="Wifi" onClick={props.onClickClose} disabled={props.isSending} />
                <div class="flex flex-col gap-14">
                    <Typography color="purple" text="h3" class="text-left">
                        Important!
                    </Typography>
                    <div class="flex flex-col gap-14">
                        <Typography color="white" text="caption" class="text-left leading-[26px]">
                            Before proceeding, you <code class="code">must</code> first restart your
                            board. Simply disconnect it and plug it back in, no buttons need to be
                            held.
                        </Typography>
                        <Typography color="white" text="caption" class="text-left leading-[26px]">
                            Once done, press <code class="code">Send Credentials</code> and give it
                            a couple of seconds until it finishes.
                        </Typography>
                        <Typography color="white" text="caption" class="text-left leading-[26px]">
                            This should setup your board proper wifi and mdns name <br /> check if
                            it connected!
                        </Typography>
                    </div>
                </div>
                <div class="flex justify-end gap-10">
                    <Button
                        isLoader={props.isSending}
                        isLoadingPrimaryButton={false}
                        isActive={false}
                        type="button"
                        label="Send credentials"
                        onClick={props.onClick}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default WifiModal
