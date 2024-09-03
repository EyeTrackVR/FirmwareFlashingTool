import { Component, createSignal, Show } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { Modal } from '@components/Modal/Index'
import ModalHeader from '@components/ModalHeader/Index'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { apModalID } from '@src/static'

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
            <div class="flex flex-col gap-[14px]">
                <ModalHeader label="AP mode" onClick={props.onClickClose} />
                <div class="flex flex-col gap-[14px]">
                    <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                        Important!
                    </p>
                    <Show
                        when={!enableAPMode()}
                        fallback={
                            <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                Before pressing the <code class="code">Send AP Request</code> check
                                that you have the firmware already{' '}
                                <code class="code">installed</code> and you are connected to
                                <code class="code">EyeTrackVR</code> Wi-Fi.
                            </p>
                        }>
                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                            Read the <code class="code">documentation</code> before turning on{' '}
                            <code class="code">AP mode</code>.
                        </p>
                    </Show>
                </div>
                <div class="flex justify-center gap-[10px]">
                    <Button
                        isActive={enableAPMode()}
                        type={'button'}
                        label={enableAPMode() ? 'Disable AP mode' : 'Enable AP mode'}
                        onClick={() => {
                            setEnableAPMode((prev) => !prev)
                        }}
                    />
                    <Button
                        isLoadingPrimaryButton={false}
                        isActive={false}
                        type={'button'}
                        label={'Send AP request'}
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
