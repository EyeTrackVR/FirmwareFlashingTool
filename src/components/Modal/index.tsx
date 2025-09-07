import Header from '@components/Header'
import { type TITLEBAR_ACTION } from '@src/static/types/enums'
import { Component, createEffect, JSX } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickCloseModal: () => void
    isActive: boolean
    id: string
    children: JSX.Element
    isSending?: boolean
    version: string
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
        <dialog closedby={'closerequest'} id={props.id} class="modal">
            <div class="fixed top-0 w-full">
                <Header onClick={props.onClickHeader} appVersion={props.version} />
            </div>
            <div class="modal-box w-auto h-auto bg-transparent overflow-visible">
                <div class="w-[500px] bg-black-900 p-12 rounded-12 border border-solid border-black-800 z-10">
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
