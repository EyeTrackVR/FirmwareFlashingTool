import { Component, createEffect, JSX } from 'solid-js'
import { Titlebar } from '@components/Titlebar'
import { type TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickCloseModal: () => void
    isActive: boolean
    id: string
    children: JSX.Element
    isSending?: boolean
}

export const Modal: Component<IProps> = (props) => {
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
                    {props.children}
                </div>
            </div>
            <form
                method="dialog"
                class="modal-backdrop"
                onClick={() => {
                    props.onClickCloseModal()
                }}>
                <button class="cursor-default" disabled={props.isSending} />
            </form>
        </dialog>
    )
}
