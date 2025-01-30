import { SelectButton } from '@components/Buttons/SelectButton'
import Dropdown from '@components/Dropdown/Dropdown'
import DropdownList from '@components/Dropdown/DropdownList'
import ModalHeader from '@components/ModalHeader'
import { Titlebar } from '@components/Titlebar'
import { type CHANNEL_TYPE, type TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import { IEventType } from '@interfaces/types'
import theme from '@src/common/theme'
import { debugModalId } from '@src/static'
import { FaSolidGear } from 'solid-icons/fa'
import { type Component, onMount } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickSetChannelMode: (data: string) => void
    setDebugMode: (debugMode: string) => void
    onClickOpenModal: (id: string) => void
    channelOptions: IDropdownList[]
    debugModes: IDropdownList[]
    channelMode: CHANNEL_TYPE
    debugMode: string
}

export const Devtools: Component<IProps> = (props) => {
    let debugModeTab: HTMLDivElement | undefined = undefined
    let versionTab: HTMLDivElement | undefined = undefined

    onMount(() => {
        if (debugModeTab) debugModeTab.style.opacity = '0'
        if (versionTab) versionTab.style.opacity = '0'
    })

    return (
        <div>
            <button
                class="ml-auto flex items-center justify-center lead w-[35px] h-[35px] rounded-100 border border-solid border-black-800 bg-black-900 cursor-pointer focus-visible:border-purple-100"
                onClick={() => {
                    props.onClickOpenModal(debugModalId)
                }}>
                <FaSolidGear size={12} fill={theme.colors.white[200]} />
            </button>
            <dialog id={debugModalId} class="modal">
                <Titlebar onClickHeader={props.onClickHeader} />
                <div class="modal-box overflow-visible flex items-center w-auto h-auto p-10 bg-transparent flex-col">
                    <div class="w-[350px] bg-black-900 p-12 rounded-12 border border-solid border-black-800 z-10 gap-6 flex flex-col">
                        <ModalHeader label="Dev tools" />
                        <Dropdown
                            onFocusOut={(event: IEventType) => {
                                const isFocusLost =
                                    event.relatedTarget instanceof HTMLElement &&
                                    event.currentTarget.contains(event.relatedTarget)
                                if (isFocusLost) return
                                if (debugModeTab) {
                                    debugModeTab.style.opacity = '0'
                                    debugModeTab.style.display = 'none'
                                }
                                if (versionTab) {
                                    versionTab.style.opacity = '0'
                                    versionTab.style.display = 'none'
                                }
                            }}>
                            <SelectButton
                                tabIndex={0}
                                header="Debug mode"
                                type="button"
                                onClick={() => {
                                    if (versionTab) {
                                        versionTab.style.display = 'none'
                                        versionTab.style.opacity = '0'
                                    }
                                    if (debugModeTab) {
                                        debugModeTab.style.display = 'block'
                                        setTimeout(() => {
                                            debugModeTab!.style.opacity = '1'
                                        }, 25)
                                    }
                                }}
                                label={!props.debugMode ? 'Select debug mode' : props.debugMode}
                            />
                            <SelectButton
                                header="Firmware channel"
                                tabIndex={1}
                                type="button"
                                onClick={() => {
                                    if (versionTab) {
                                        versionTab!.style.display = 'block'
                                        setTimeout(() => {
                                            versionTab!.style.opacity = '1'
                                        }, 25)
                                    }
                                    if (debugModeTab) {
                                        debugModeTab.style.opacity = '0'
                                        debugModeTab.style.display = 'none'
                                    }
                                }}
                                label={props.channelMode}
                            />
                            <DropdownList
                                activeElement={props.debugMode}
                                data={props.debugModes}
                                tabIndex={0}
                                ref={(el) => (debugModeTab = el)}
                                onClick={(data) => {
                                    props.setDebugMode(data.label)
                                }}
                            />
                            <DropdownList
                                ref={(el) => (versionTab = el)}
                                activeElement={props.channelMode}
                                data={props.channelOptions}
                                tabIndex={1}
                                onClick={(data) => {
                                    props.onClickSetChannelMode(data.label)
                                }}
                            />
                        </Dropdown>
                    </div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button class="cursor-default" />
                </form>
            </dialog>
        </div>
    )
}
