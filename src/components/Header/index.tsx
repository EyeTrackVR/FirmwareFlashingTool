import DefaultButton from '@components/Buttons/DefaultButton'
import Typography from '@components/Typography'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { classNames } from '@src/utils'
import { TbOutlineDatabaseExport } from 'solid-icons/tb'
import { Component, Show } from 'solid-js'

interface IProps {
    onClickHome?: () => void
    onClick: (action: TITLEBAR_ACTION) => void
    onClickDownloadLogs?: () => void
    appVersion?: string
    docs?: boolean
}

const Header: Component<IProps> = (props) => {
    return (
        <header class="w-full" data-tauri-drag-region>
            <div class="flex flex-col w-full items-end">
                <div class="h-8" />
                <div class="w-full flex items-center flex-row">
                    <div
                        class="flex flex-row w-full items-center justify-between h-38 px-8"
                        data-tauri-drag-region>
                        <div class="flex flex-row items-center gap-4">
                            <Show when={!props.docs}>
                                <div
                                    class="flex items-center gap-4 cursor-pointer"
                                    onClick={() => {
                                        props.onClickHome?.()
                                    }}>
                                    <img
                                        src={'images/logo.png'}
                                        class="min-w-[34px] min-h-[34px] w-[34px] h-[34px]"
                                    />
                                    <Typography color="white" text="caption" nowrap>
                                        EyetrackVR
                                    </Typography>
                                </div>
                            </Show>
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
                        </div>
                        <div class="flex flex-row items-center">
                            <Show when={!props.docs && props.onClickDownloadLogs}>
                                <div
                                    class="px-8 py-4 rounded-4 ml-4 cursor-pointer group hover:bg-transparentGreen-200 duration-150 transition-colors"
                                    onClick={() => {
                                        props.onClickDownloadLogs?.()
                                    }}>
                                    <Typography
                                        color="white"
                                        text="small"
                                        class="tracking-[0.08em] group-hover:text-green-200 duration-150 transition-colors">
                                        <TbOutlineDatabaseExport class="w-16 h-16" />
                                    </Typography>
                                </div>
                            </Show>
                            <DefaultButton
                                class={classNames(
                                    'w-30 h-30 flex items-center justify-center transition group',
                                    props.docs ? 'hover:bg-brown-300' : 'hover:bg-blue-800',
                                )}
                                onClick={() => {
                                    props.onClick(TITLEBAR_ACTION.MINIMIZE)
                                }}>
                                <svg width="16px" height="16px" viewBox="0 0 24 24">
                                    <path fill="#ffffff" d="M20 14H4v-4h16" />
                                </svg>
                            </DefaultButton>
                            <DefaultButton
                                class={classNames(
                                    'w-30 h-30 flex items-center justify-center transition group',
                                    props.docs ? 'hover:bg-brown-300' : 'hover:bg-blue-800',
                                )}
                                onClick={() => {
                                    props.onClick(TITLEBAR_ACTION.MAXIMIZE)
                                }}>
                                <svg width="16px" height="16px" viewBox="0 0 24 24">
                                    <path fill="#ffffff" d="M4 4h16v16H4zm2 4v10h12V8z" />
                                </svg>
                            </DefaultButton>
                            <DefaultButton
                                class={classNames(
                                    'w-30 h-30 flex items-center justify-center transition group',
                                    props.docs ? 'hover:bg-brown-300' : 'hover:bg-red-100',
                                )}
                                onClick={() => {
                                    props.onClick(TITLEBAR_ACTION.CLOSE)
                                }}>
                                <svg width="16px" height="16px" viewBox="0 0 24 24">
                                    <path
                                        fill="white"
                                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                                    />
                                </svg>
                            </DefaultButton>
                        </div>
                    </div>
                </div>
                <Show when={props.docs}>
                    <div class="h-3" />
                </Show>
            </div>
        </header>
    )
}

export default Header
