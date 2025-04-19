import Header from '@components/Header'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { type TITLEBAR_ACTION } from '@src/static/types/enums'
import { Component, createEffect, JSX, ParentComponent } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickCloseModal: () => void
    onClickSettings: () => void
    connectionStatus: CONNECTION_STATUS
    isSending?: boolean
    appVersion: string
    isActive: boolean
    id: string
}

export const Modal: ParentComponent<IProps> = (props) => {
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
            <div class="fixed top-0 w-full">
                <Header
                    onClick={props.onClickHeader}
                    appVersion={props.appVersion}
                    connectionStatus={props.connectionStatus}
                    onClickSettings={props.onClickSettings}
                />
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
