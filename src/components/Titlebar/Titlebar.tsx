import { Component } from 'solid-js'
import { TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
}

export const Titlebar: Component<IProps> = (props) => {
    return (
        <div data-tauri-drag-region class="titlebar">
            <div
                class="titlebar-button"
                onClick={() => {
                    props.onClickHeader(TITLEBAR_ACTION.MINIMIZE)
                }}>
                <img
                    src="https://api.iconify.design/mdi:window-minimize.svg"
                    alt={TITLEBAR_ACTION.MINIMIZE}
                />
            </div>
            <div
                class="titlebar-button"
                onClick={() => {
                    props.onClickHeader(TITLEBAR_ACTION.MAXIMIZE)
                }}>
                <img
                    src="https://api.iconify.design/mdi:window-maximize.svg"
                    alt={TITLEBAR_ACTION.MAXIMIZE}
                />
            </div>
            <div
                class="titlebar-button"
                onClick={() => {
                    props.onClickHeader(TITLEBAR_ACTION.CLOSE)
                }}>
                <img src="https://api.iconify.design/mdi:close.svg" alt={TITLEBAR_ACTION.CLOSE} />
            </div>
        </div>
    )
}
