import { FaSolidGear } from 'solid-icons/fa'
import { Component } from 'solid-js'
import DebugModeMenu from '../Debug'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { debugModalId } from '@src/static'
import { TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    debugMode: string
    debugModes: string[]
    setDebugMode: (debugMode: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickOpenModal: (id: string) => void
}

export const DebugMode: Component<IProps> = (props) => {
    return (
        <div>
            <button
                class="ml-auto flex items-center justify-center leadu w-[35px] h-[35px] rounded-full border border-solid border-[#192736] bg-[#0D1B26] cursor-pointer focus-visible:border-[#9793FD]"
                onClick={(e) => {
                    e.preventDefault()
                    props.onClickOpenModal(debugModalId)
                }}>
                <FaSolidGear size={12} fill="#FFFFFFe3" />
            </button>
            <dialog id={debugModalId} class="modal">
                <Titlebar onClickHeader={props.onClickHeader} />
                <div class="modal-box overflow-visible flex items-center  w-auto h-auto p-[10px] bg-transparent ">
                    <DebugModeMenu
                        debugMode={props.debugMode}
                        debugModes={props.debugModes}
                        setDebugMode={props.setDebugMode}
                    />
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button class="cursor-default">close</button>
                </form>
            </dialog>
        </div>
    )
}
