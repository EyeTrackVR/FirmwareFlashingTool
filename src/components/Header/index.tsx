import ConnectionStatus from '@components/ConnectionStatus'
import { ProgressBar } from '@components/ProgressBar'
import Typography from '@components/Typography'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import theme from '@src/common/theme'
import { IoSettingsSharp } from 'solid-icons/io'
import { Component, Show } from 'solid-js'

interface IProps {
    onClickHome?: () => void
    onClickSettings?: () => void
    onClick: (action: TITLEBAR_ACTION) => void
    step?: { step: string; description: string; dashoffset: string; index: string }
    connectionStatus?: CONNECTION_STATUS
    appVersion?: string
    currentStep?: string
    docs?: boolean
}

const Header: Component<IProps> = (props) => {
    return (
        <header class="w-full" data-tauri-drag-region>
            <div
                class="flex flex-col w-full items-end"
                classList={{
                    'bg-brown-800': props.docs,
                }}>
                <div class="h-8" />
                <div class="w-full flex items-center flex-row">
                    <div
                        class="flex flex-row w-full items-center justify-between h-38 px-8"
                        data-tauri-drag-region>
                        <div class="flex flex-row items-center gap-4">
                            <Show when={!props.docs}>
                                <img
                                    onClick={() => props.onClickHome?.()}
                                    src={'images/logo.png'}
                                    class="min-w-[34px] min-h-[34px] w-[34px] h-[34px] cursor-pointer"
                                />
                                <Typography color="white" text="caption" nowrap>
                                    EyetrackVR
                                </Typography>
                                <Show when={props.appVersion}>
                                    <div class="bg-transparentGreen-200 px-8 py-4 rounded-4 ml-4">
                                        <Typography
                                            color="green"
                                            text="small"
                                            class="tracking-[0.08em]">
                                            {props.appVersion}
                                        </Typography>
                                    </div>
                                </Show>
                            </Show>
                        </div>
                        <div class="flex flex-row items-center">
                            <Show
                                when={!props.docs || typeof props.connectionStatus !== 'undefined'}>
                                <div class="w-30 h-30 flex items-center justify-center transition">
                                    <ConnectionStatus status={props.connectionStatus!} />
                                </div>
                                <div
                                    class="w-30 h-30 flex items-center justify-center transition cursor-pointer"
                                    onClick={() => {
                                        props.onClickSettings?.()
                                    }}>
                                    <IoSettingsSharp color={theme.colors.blue[500]} size={16} />
                                </div>
                            </Show>
                            <div
                                classList={{
                                    'hover:bg-brown-300': props.docs,
                                    'hover:bg-blue-800': !props.docs,
                                }}
                                class="w-30 h-30 flex items-center justify-center transition"
                                onClick={() => {
                                    props.onClick(TITLEBAR_ACTION.MINIMIZE)
                                }}>
                                <svg width="16px" height="16px" viewBox="0 0 24 24">
                                    <path fill="#ffffff" d="M20 14H4v-4h16" />
                                </svg>
                            </div>
                            <div
                                classList={{
                                    'hover:bg-brown-300': props.docs,
                                    'hover:bg-blue-800': !props.docs,
                                }}
                                class="w-30 h-30 flex items-center justify-center transition"
                                onClick={() => {
                                    props.onClick(TITLEBAR_ACTION.MAXIMIZE)
                                }}>
                                <svg width="16px" height="16px" viewBox="0 0 24 24">
                                    <path fill="#ffffff" d="M4 4h16v16H4zm2 4v10h12V8z" />
                                </svg>
                            </div>
                            <div
                                class="w-30 h-30 flex items-center justify-center hover:bg-red-100 transition"
                                onClick={() => {
                                    props.onClick(TITLEBAR_ACTION.CLOSE)
                                }}>
                                <svg width="16px" height="16px" viewBox="0 0 24 24">
                                    <path
                                        fill="white"
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <Show when={props.docs}>
                    <div class="h-3" />
                </Show>
                <Show
                    when={
                        typeof props.step !== 'undefined' &&
                        typeof props.currentStep !== 'undefined'
                    }>
                    <div class="flex flex-row justify-center items-center gap-6 min-w-[210px] pr-24">
                        <ProgressBar
                            currentStep={props?.currentStep ?? '0'}
                            dashoffset={props?.step?.dashoffset ?? '0'}
                        />
                        <div class="flex flex-col items-start justify-end w-full gap-4">
                            <Typography color="white" text="captionBold">
                                {props?.step?.step ?? '0'}
                            </Typography>
                            <Typography color="white" text="small">
                                {props?.step?.description ?? '--'}
                            </Typography>
                        </div>
                    </div>
                </Show>
            </div>
        </header>
    )
}

export default Header
