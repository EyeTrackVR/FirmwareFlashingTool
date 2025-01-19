import { Component } from 'solid-js'
import { TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
}

export const Titlebar: Component<IProps> = (props) => {
    return (
        <div data-tauri-drag-region class="customTitlebar">
            <div
                class="titlebar-button"
                onClick={() => {
                    props.onClickHeader(TITLEBAR_ACTION.MINIMIZE)
                }}>
                <svg width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M20 14H4v-4h16" />
                </svg>
            </div>
            <div
                class="titlebar-button"
                onClick={() => {
                    props.onClickHeader(TITLEBAR_ACTION.MAXIMIZE)
                }}>
                <svg width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M4 4h16v16H4zm2 4v10h12V8z" />
                </svg>
            </div>
            <div
                class="titlebar-button"
                onClick={() => {
                    props.onClickHeader(TITLEBAR_ACTION.CLOSE)
                }}>
                <svg width="1em" height="1em" viewBox="0 0 24 24">
                    <path
                        fill="white"
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" />
                </svg>
            </div>
        </div>
    )
}
