import { Component, For } from 'solid-js'
import { Board } from '../Board/Board'
import { SelectButton } from '@components/Buttons/SelectButton'

export interface IProps {
    boards: Array<{ board: string; description: string; debugMode?: boolean }>
    onSubmit: (board: string) => void
    selectedBoard: string
    firmwareVersion: string
}

export const SelectBoard: Component<IProps> = (props) => {
    return (
        <div class="relative w-[285px] p-[24px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]">
            <div class="flex flex-col gap-[10px]">
                <div class="flex justify-between">
                    <div class="text-left text-[14px] text-white font-[500] leading-[14px] not-italic">
                        <p>Select board</p>
                    </div>
                </div>
                <div>
                    <div class="dropdown w-full">
                        <SelectButton
                            tabIndex={0}
                            type="button"
                            label={!props.selectedBoard ? 'Select board' : props.selectedBoard}
                        />
                        <div
                            tabIndex={0}
                            class="dropdown-content right-[-25px]  mt-[58px]  p-[12px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26] w-[285px]">
                            <div class="overflow-y-scroll max-h-[250px] flex flex-col gap-[10px] w-full">
                                {!props.boards.length ? (
                                    <div class="flex flex-row gap-[6px]">
                                        <span class="loading loading-ring loading-md" />
                                        <p>Looking for boards!</p>
                                    </div>
                                ) : (
                                    <For each={props.boards}>
                                        {(data) => (
                                            <Board
                                                isActive={props.selectedBoard === data.board}
                                                {...data}
                                                onClick={() => {
                                                    props.onSubmit(data.board)
                                                }}
                                            />
                                        )}
                                    </For>
                                )}
                            </div>
                        </div>
                    </div>
                    <div class="pt-[10px] text-left text-[12px] text-white font-[500] leading-[16px] not-italic">
                        <div class="flex gap-[4px] items-center">
                            <p>Firmware version:</p>
                            {!props.firmwareVersion ? (
                                <span class="loading loading-ring loading-xs" />
                            ) : (
                                <p>{props.firmwareVersion}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
