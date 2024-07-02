import { Component, createEffect, createSignal, Show } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import ModalHeader from '@components/Modal/ModalHeader/Index'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { apModalID } from '@src/static'
import { type TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickCloseModal: () => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickConfigurAPMode: () => void
    isAPModeActive: boolean
}

export const APMode: Component<IProps> = (props) => {
    const [enableAPMode, setEnableAPMode] = createSignal(false)

    createEffect(() => {
        if (props.isAPModeActive) {
            const el = document.getElementById(apModalID)
            if (el instanceof HTMLDialogElement) {
                el.showModal()
            }
        }
    })

    return (
        <dialog id={apModalID} class="modal">
            <Titlebar onClickHeader={props.onClickHeader} />
            <div class="modal-box w-auto h-auto bg-transparent overflow-visible">
                <div class="w-[500px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                    <div class="flex flex-col gap-[14px]">
                        <ModalHeader label="AP mode" onClick={props.onClickCloseModal} />
                        <div class="flex flex-col gap-[14px]">
                            <div>
                                <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                                    Important!
                                </p>
                            </div>
                            <div>
                                <Show
                                    when={!enableAPMode()}
                                    fallback={
                                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                            Before pressing the{' '}
                                            <code class="code">Send AP Request</code> check that you
                                            have the firmware already{' '}
                                            <code class="code">installed</code> and you are
                                            connected to
                                            <code class="code">EyeTrackVR</code> Wi-Fi.
                                        </p>
                                    }>
                                    <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                        Read the <code class="code">documentation</code> before
                                        turning on <code class="code">AP mode</code>.
                                    </p>
                                </Show>
                            </div>
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
                                onClick={props.onClickConfigurAPMode}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <form
                method="dialog"
                class="modal-backdrop"
                onClick={() => {
                    props.onClickCloseModal()
                }}>
                <button class="cursor-default" />
            </form>
        </dialog>
    )
}
