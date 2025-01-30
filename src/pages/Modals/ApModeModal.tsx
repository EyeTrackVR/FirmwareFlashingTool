import { Component, createSignal, Show } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { Modal } from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { apModalID } from '@src/static'
import Typography from '@components/Typography'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickClose: () => void
    onClick: () => void
    isActive: boolean
}

const ApModeModal: Component<IProps> = (props) => {
    const [enableAPMode, setEnableAPMode] = createSignal(false)

    return (
        <Modal
            id={apModalID}
            isActive={props.isActive}
            onClickCloseModal={props.onClickClose}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-14">
                <ModalHeader label="AP mode" onClick={props.onClickClose} />
                <div class="flex flex-col gap-14">
                    <Typography color="purple" text="h3" class="text-left">
                        Important!
                    </Typography>
                    <Show
                        when={!enableAPMode()}
                        fallback={
                            <Typography
                                color="white"
                                text="caption"
                                class="text-left leading-[26px]">
                                Before pressing the <code class="code">Send AP Request</code> check
                                that you have the firmware already{' '}
                                <code class="code">installed</code> and you are connected to
                                <code class="code">EyeTrackVR</code> Wi-Fi.
                            </Typography>
                        }>
                        <Typography color="white" text="caption" class="text-left">
                            Read the <code class="code">documentation</code> before turning on
                            <code class="code">AP mode</code>.
                        </Typography>
                    </Show>
                </div>
                <div class="flex justify-center gap-10">
                    <Button
                        isActive={enableAPMode()}
                        type="button"
                        label={enableAPMode() ? 'Disable AP mode' : 'Enable AP mode'}
                        onClick={() => {
                            setEnableAPMode((prev) => !prev)
                        }}
                    />
                    <Button
                        isLoadingPrimaryButton={false}
                        isActive={false}
                        type="button"
                        label="Send AP request"
                        onClick={() => {
                            if (!enableAPMode()) return
                            props.onClick()
                        }}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default ApModeModal
