import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import { Footer } from '@components/Footer/Footer'
import Firmware from '@components/Terminal/Firmware/Index'
import Step from '@components/Terminal/Step/Index'
import TerminalHeader from '@components/Terminal/TerminalHeader/Index'
import { FLASH_STATUS, FLASH_STEP } from '@interfaces/enums'
import { IFirmwareState } from '@interfaces/interfaces'
import { VirtualList } from '@pages/VirtualList/Index'

export interface IProps {
    onClickInstallOpenIris: () => void
    onClickUpdateNetwork: () => void
    onClickDownloadLogs: () => void
    onClickOpenDocs: () => void
    onClickGetLogs: () => void
    onClickAPMode: () => void
    onClickSetup: () => void
    onClickBack: () => void
    percentageProgress: number
    logs: Record<FLASH_STEP, string[]> | object
    firmwareState: IFirmwareState[]
    isActiveProcess: boolean
    firmwareVersion: string
    isUSBBoard: boolean
    board: string
}

const Terminal: Component<IProps> = (props) => {
    const [hover, setHover] = createSignal<Record<FLASH_STEP, boolean> | object>({})
    const [open, setOpen] = createSignal<Record<FLASH_STEP, boolean> | object>({})
    let containerRef

    createEffect(() => {
        if (props.firmwareState.length) {
            containerRef.scrollTop = containerRef.scrollHeight
        }
    })

    return (
        <div class="flex flex-col justify-between h-full gap-[12px] pt-[24px] w-full">
            <div class="flex h-full justify-center items-center overflow-hidden">
                <div class="max-w-[1800px] h-full w-full bg-[#0D1B26] p-[12px] flex flex-col gap-[12px] rounded-[12px] border-solid border-1 border-[#192736]">
                    <div class="flex flex-col gap-[12px]">
                        <TerminalHeader onClickOpenDocs={props.onClickOpenDocs} />
                    </div>
                    <div class="flex flex-col overflow-hidden w-full h-full bg-[#00101C] p-[24px] rounded-[12px] gap-[12px]">
                        <div class="flex p-[12px] justify-between items-center">
                            <Firmware version={props.firmwareVersion} board={props.board} />
                        </div>
                        <div
                            class="flex flex-col overflow-y-auto h-full w-full scrollbar"
                            ref={containerRef}>
                            <div class="flex flex-col gap-[12px] ">
                                <Show when={props.firmwareState.length}>
                                    <For each={props.firmwareState}>
                                        {(element) => {
                                            return (
                                                <div class="flex flex-col gap-[6px]">
                                                    <div
                                                        class="w-full"
                                                        onMouseEnter={() => {
                                                            if (open()[element.step]) return
                                                            setHover({ [element.step]: true })
                                                        }}
                                                        onMouseLeave={() => {
                                                            if (open()[element.step]) return
                                                            setHover({ [element.step]: false })
                                                        }}>
                                                        <Step
                                                            progress={
                                                                element.step ===
                                                                    FLASH_STEP.FLASH_FIRMWARE &&
                                                                element.status !==
                                                                    FLASH_STATUS.FAILED
                                                                    ? props.percentageProgress
                                                                    : undefined
                                                            }
                                                            {...element}
                                                            hasLogs={
                                                                props.logs[element.step]?.length ??
                                                                false
                                                            }
                                                            onMouseDown={() => {
                                                                setOpen({
                                                                    ...open(),
                                                                    [element.step]:
                                                                        !open()[element.step],
                                                                })
                                                            }}
                                                            hover={hover()[element.step] ?? false}
                                                            open={open()[element.step]}
                                                        />
                                                    </div>
                                                    <Show when={open()[element.step]}>
                                                        <div class="px-[12px]">
                                                            <VirtualList
                                                                items={
                                                                    props.logs[element.step] ?? []
                                                                }
                                                            />
                                                            <div class="w-full h-[1px] border-b-[1px] border-solid border-[#192736]" />
                                                        </div>
                                                    </Show>
                                                </div>
                                            )
                                        }}
                                    </For>
                                </Show>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-[12px] max-[890px]:flex-col flex-row">
                        <Footer
                            isPrimaryButtonDisabled={props.isActiveProcess}
                            isSecondButtonDisabled={props.isActiveProcess}
                            secondLabel="Install Openiris"
                            primaryLabel="Show logs"
                            size="max-[890px]:w-full"
                            styles="!justify-start"
                            isPrimaryActive={true}
                            isSecondActive={true}
                            onClickPrimary={() => {
                                setOpen({})
                                props.onClickGetLogs()
                            }}
                            onClickSecond={() => {
                                setOpen({})
                                props.onClickInstallOpenIris()
                            }}
                        />
                        <Footer
                            isPrimaryButtonDisabled={props.isActiveProcess}
                            isSecondButtonDisabled={props.isActiveProcess}
                            primaryLabel="Update Network"
                            size="max-[890px]:w-full"
                            isPrimaryActive={true}
                            secondLabel="Download logs"
                            styles="w-full"
                            hidePrimaryButton={props.isUSBBoard}
                            onClickPrimary={() => {
                                setOpen({})
                                props.onClickUpdateNetwork()
                            }}
                            onClickSecond={props.onClickDownloadLogs}
                        />
                        <Show when={!props.isUSBBoard}>
                            <Footer
                                styles="max-[890px]:w-full !w-auto"
                                size="max-[890px]:w-full"
                                primaryLabel="AP mode"
                                isPrimaryActive={true}
                                onClickPrimary={() => {
                                    setOpen({})
                                    props.onClickAPMode()
                                }}
                            />
                        </Show>
                    </div>
                </div>
            </div>
            <div>
                <Footer
                    isPrimaryButtonDisabled={props.isActiveProcess}
                    onClickSecond={() => {
                        setOpen({})
                        setHover({})
                        props.onClickBack()
                    }}
                    onClickPrimary={() => {
                        setOpen({})
                        setHover({})
                        props.onClickSetup()
                    }}
                    isPrimaryActive={false}
                    secondLabel="Back"
                    primaryLabel="Setup etvr"
                />
            </div>
        </div>
    )
}

export default Terminal
