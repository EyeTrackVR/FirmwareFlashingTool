import { FaSolidWifi } from 'solid-icons/fa'
import { Component } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { FlashButton } from '@components/Buttons/FlashButton/FlashButton'
import ModalHeader from '@components/Modal/ModalHeader/Index'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { wifiModalID } from '@src/static'
import { type TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickOpenModal: (id: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    sendWifiCredentials: () => void
    isSending: boolean
}

export const WifiCredentials: Component<IProps> = (props) => {
    return (
        <div>
            <FlashButton
                step="3/3"
                label="Send wifi network credentials"
                img={<FaSolidWifi size={48} fill="#FFFFFFe3" />}
                onClick={() => {
                    props.onClickOpenModal(wifiModalID)
                }}
            />
            <dialog id={wifiModalID} class="modal">
                <Titlebar onClickHeader={props.onClickHeader} />
                <div class="modal-box w-auto h-auto bg-transparent overflow-visible">
                    <div class="w-[500px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                        <div class="flex flex-col gap-[14px]">
                            <ModalHeader label="Wifi" disabled={props.isSending} />
                            <div class="flex flex-col gap-[14px]">
                                <div>
                                    <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                                        Important!
                                    </p>
                                </div>
                                <div>
                                    <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                        Before proceeding, you <code>must</code> first restart your
                                        board. Simply disconnect it and plug it back in, no buttons
                                        need to be held.
                                    </p>
                                    <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic py-[10px]">
                                        Once done, press <code>Send Credentials</code> and give it a
                                        couple of seconds until it finishes.
                                    </p>
                                    <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                        This should setup your board wifi proper wifi and mdns name,
                                        check if it connected!
                                    </p>
                                </div>
                            </div>
                            <div class="flex justify-end gap-[10px]">
                                <Button
                                    isLoadingPrimaryButton={props.isSending}
                                    isActive={!props.isSending}
                                    isLoader={props.isSending}
                                    type={'button'}
                                    label={'Send credentials'}
                                    onClick={() => {
                                        if (props.isSending) return
                                        props.sendWifiCredentials()
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button class="cursor-default" disabled={props.isSending} />
                </form>
            </dialog>
        </div>
    )
}
