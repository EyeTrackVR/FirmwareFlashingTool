import { Show, For, Component } from 'solid-js'
import { Board } from '../Board/Board'
import { SelectButton } from '@components/Buttons/SelectButton'

export interface IProps {
    boards: Array<{ board: string; description: string; debugMode?: boolean }>
    onSubmit: (board: string) => void
    onClick: () => void
    selectedBoard: string
    firmwareVersion: string
    show: boolean
    ref?: HTMLDivElement
}

export const SelectBoard: Component<IProps> = (props) => {
    return (
        <div
            class="relative w-[285px] p-[24px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]"
            ref={props.ref}>
            <div class="flex flex-col gap-[10px]">
                <div class="flex justify-between">
                    <div class="text-left text-[14px] text-white font-[500] leading-[14px] not-italic">
                        <p>Select board</p>
                    </div>
                </div>
                <div>
                    <SelectButton
                        type="button"
                        label={!props.selectedBoard ? 'Select board' : props.selectedBoard}
                        onClick={() => {
                            props.onClick()
                        }}
                    />
                    <div class="pt-[10px] text-left text-[12px] text-white font-[500] leading-[14px] not-italic">
                        <p>
                            Firmware version:{' '}
                            {!props.firmwareVersion ? '--' : props.firmwareVersion}
                        </p>
                    </div>
                </div>
            </div>
            <Show when={props.show}>
                <div class="absolute right-0 mt-[34px] w-full p-[12px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]">
                    <div class="overflow-y-scroll max-h-[250px] flex flex-col gap-[10px]">
                        {!props.boards.length ? (
                            <div class="text-left text-[12px] text-white font-[500] leading-[14px] not-italic">
                                <p>No boards to show</p>
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
            </Show>
        </div>
    )
}
