import { FaSolidXmark } from 'solid-icons/fa'
import { Component, createMemo, Show } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { apModalID } from '@src/static'
import { TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickOpenModal: (id: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickEnableAPMode: () => void
    onClickConfigurAPMode: () => void
    isAPModeActive: boolean
}

export const APMode: Component<IProps> = (props) => {
    const buttonLabel = createMemo(() =>
        props.isAPModeActive ? 'Disable AP mode' : 'Enable AP mode',
    )

    return (
        <div>
            <button
                classList={{
                    'border-[#192736] bg-[#9793FD] cursor-pointer focus-visible:border-[#fff]':
                        props.isAPModeActive,
                    'border-[#192736] bg-[#0D1B26]  focus-visible:border-[#9793FD]':
                        !props.isAPModeActive,
                }}
                class={
                    'ml-auto flex items-center justify-center lead pt-[10.5px] pb-[10.5px] pl-[10.5px] pr-[10.5px] rounded-full border border-solid cursor-pointer'
                }
                onClick={(e) => {
                    e.preventDefault()
                    props.onClickOpenModal(apModalID)
                }}>
                <p class="text-white font-normal leading-[12px]">AP mode</p>
            </button>
            <dialog id={apModalID} class="modal">
                <Titlebar onClickHeader={props.onClickHeader} />
                <div class="modal-box w-auto h-auto bg-transparent overflow-visible">
                    <div class="w-[500px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                        <div class="flex flex-col gap-[14px]">
                            <div class="flex justify-between">
                                <div>
                                    <p class="text-left text-[18px] text-white font-normal leading-[20px] not-italic">
                                        AP mode
                                    </p>
                                </div>
                                <div class="modal-action mt-0">
                                    <form method="dialog">
                                        <button class="cursor-pointer p-[4px]  rounded-full border border-solid border-[#0D1B26] focus-visible:border-[#9793FD]">
                                            <p class="text-white text-left">
                                                <FaSolidXmark size={20} fill="#FFFFFF" />
                                            </p>
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div class="flex flex-col gap-[14px]">
                                <div>
                                    <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                                        Important!
                                    </p>
                                </div>
                                <div>
                                    <Show
                                        when={!props.isAPModeActive}
                                        fallback={
                                            <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                                Before pressing the <code>Send AP Request</code>{' '}
                                                check that you have the firmware already{' '}
                                                <code>installed</code> and you are connected to
                                                <code>EyeTrackVR</code> Wi-Fi.
                                            </p>
                                        }>
                                        <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                            Read the <code>documentation</code> before turning on{' '}
                                            <code>AP mode</code>.
                                        </p>
                                    </Show>
                                </div>
                            </div>
                            <div class="flex justify-center gap-[10px]">
                                <Button
                                    isActive={props.isAPModeActive}
                                    type={'button'}
                                    label={buttonLabel()}
                                    onClick={props.onClickEnableAPMode}
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
                <form method="dialog" class="modal-backdrop">
                    <button class="cursor-default" />
                </form>
            </dialog>
        </div>
    )
}
