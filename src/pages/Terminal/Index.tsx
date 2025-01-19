import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import { Button } from '@components/Buttons/DefaultButton'
import { Footer } from '@components/Footer'
import PortDropdown from '@components/Dropdown/PortDropdown'
import Firmware from '@components/Terminal/Firmware'
import Step from '@components/Terminal/Step'
import TerminalHeader from '@components/Terminal/TerminalHeader'
import { FLASH_STATUS, FLASH_STEP } from '@interfaces/enums'
import { IActivePort, IDropdownList, IFirmwareState } from '@interfaces/interfaces'
import { VirtualList } from '@pages/VirtualList/Index'
import { DEFAULT_PORT_NAME } from '@src/static'
import { shortName } from '@src/utils'

export interface IProps {
    onClickInstallOpenIris: () => void
    onClickUpdateNetwork: () => void
    onClickDownloadLogs: () => void
    onClickOpenDocs: () => void
    onClickGetLogs: () => void
    onClickAPMode: () => void
    onClickPort: (port: string) => void
    onClickBack: () => void
    logs: Record<FLASH_STEP, string[]> | object
    firmwareState: IFirmwareState[]
    ports: IDropdownList[]
    percentageProgress: number
    isActiveProcess: boolean
    firmwareVersion: string
    isUSBBoard: boolean
    activePort: IActivePort
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

    const handleClick = (action: () => void) => () => {
        setOpen({})
        action()
    }

    const renderPortDropdown = (additionalClass: string) => (
        <PortDropdown
            class={additionalClass}
            onClick={(port) => props.onClickPort(port.label)}
            data={props.ports}
            isScrollbar={props.ports.length >= 4}
            label={shortName(
                props.activePort.autoSelect
                    ? DEFAULT_PORT_NAME
                    : props.activePort.activePortName.toLowerCase(),
                3,
            )}
            activeElement={
                props.activePort.autoSelect ? DEFAULT_PORT_NAME : props.activePort.activePortName
            }
        />
    )

    return (
        <div class="flex flex-col justify-between h-full gap-[12px] pt-[24px]">
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
                    <div class="flex gap-3 max-[1027px]:flex-col flex-row w-full">
                        <div class="flex gap-3">
                            <Button
                                size="max-[1027px]:w-[92%]"
                                type="button"
                                label="Install Openiris"
                                isActive={true}
                                onClick={handleClick(props.onClickInstallOpenIris)}
                            />
                            <Button
                                size="max-[1027px]:hidden"
                                type="button"
                                label="Show logs"
                                onClick={handleClick(props.onClickGetLogs)}
                            />
                            {renderPortDropdown('max-[1027px]:visible !w-full min-[1028px]:hidden')}
                        </div>
                        <div class="flex w-full justify-end gap-3">
                            <Button
                                size="max-[1027px]:w-full"
                                type="button"
                                label="Download logs"
                                onClick={props.onClickDownloadLogs}
                            />
                            <Button
                                size="max-[1027px]:visible w-full min-[1028px]:hidden"
                                type="button"
                                label="Show logs"
                                onClick={handleClick(props.onClickGetLogs)}
                            />
                            <Show when={!props.isUSBBoard}>
                                <Button
                                    size="max-[1027px]:hidden"
                                    type="button"
                                    label="Update Network"
                                    onClick={handleClick(props.onClickUpdateNetwork)}
                                />
                            </Show>
                        </div>
                        <Show when={!props.isUSBBoard}>
                            <div class="max-[1027px]:flex gap-3">
                                <Button
                                    size="max-[1027px]:w-full"
                                    type="button"
                                    label="AP mode"
                                    onClick={handleClick(props.onClickAPMode)}
                                />
                                <Button
                                    size="max-[1027px]:visible w-full min-[1028px]:hidden"
                                    type="button"
                                    label="Update Network"
                                    onClick={handleClick(props.onClickUpdateNetwork)}
                                />
                            </div>
                        </Show>
                        {renderPortDropdown('max-[1027px]:hidden !w-auto min-[1028px]:visible')}
                    </div>
                </div>
            </div>
            <Footer
                isPrimaryButtonDisabled={props.isActiveProcess}
                onClickSecond={() => {
                    setOpen({})
                    setHover({})
                    props.onClickBack()
                }}
                secondLabel="Back"
            />
        </div>
    )
}

export default Terminal
