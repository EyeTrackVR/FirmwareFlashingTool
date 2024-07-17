import { Component, createEffect, createSignal, JSX } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import ModalHeader from '@components/ModalHeader/Index'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { type TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickCloseModal: () => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickConfigureAPMode: () => void
    isActive: boolean
    children: (status: boolean) => JSX.Element
    id: string
}

export const Modal: Component<IProps> = (props) => {
    const [enableAPMode, setEnableAPMode] = createSignal(false)

    createEffect(() => {
        if (props.isActive) {
            const el = document.getElementById(props.id)
            if (el instanceof HTMLDialogElement) {
                el.showModal()
            }
        }
    })

    return (
        <dialog id={props.id} class="modal">
            <Titlebar onClickHeader={props.onClickHeader} />
            <div class="modal-box w-auto h-auto bg-transparent overflow-visible">
                <div class="w-[500px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                    <div class="flex flex-col gap-[14px]">
                        <ModalHeader label="AP mode" onClick={props.onClickCloseModal} />
                        <div class="flex flex-col gap-[14px]">
                            <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                                Important!
                            </p>
                            {props.children(!enableAPMode())}
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
                                    props.onClickConfigureAPMode()
                                }}
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
