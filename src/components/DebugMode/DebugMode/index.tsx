import { FaSolidGear } from 'solid-icons/fa'
import { Component, Show } from 'solid-js'
import DebugModeMenu from '../Debug'

export interface IProps {
    onClick: () => void
    isOpen: boolean
    ref: HTMLDivElement
    debugMode: string
    debugModes: string[]
    setDebugMode: (debugMode: string) => void
    onClickOpen: () => void
    open: boolean
}

export const DebugMode: Component<IProps> = (props) => {
    return (
        <div ref={props.ref}>
            <button
                class=" ml-auto flex items-center justify-center leadu w-[35px] h-[35px] rounded-full border border-solid border-[#192736] bg-[#0D1B26] focus-visible:border-[#9793FD] cursor-pointer"
                onClick={(e) => {
                    e.preventDefault()
                    props.onClick()
                }}>
                <p class="text-white leading-[12px]">
                    <FaSolidGear size={12} fill="#FFFFFFe3" />
                </p>
            </button>
            <Show when={props.isOpen}>
                <DebugModeMenu
                    onClickOpen={props.onClickOpen}
                    open={props.open}
                    onClick={props.onClick}
                    debugMode={props.debugMode}
                    debugModes={props.debugModes}
                    setDebugMode={props.setDebugMode}
                />
            </Show>
        </div>
    )
}
