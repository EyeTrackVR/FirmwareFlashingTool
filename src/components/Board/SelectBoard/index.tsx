import { Component, Show } from 'solid-js'
import { SelectButton } from '@components/Buttons/SelectButton'
import Dropdown from '@components/Dropdown/Dropdown'
import DropdownList from '@components/Dropdown/DropdownList'
import { type IDropdownList } from '@interfaces/interfaces'

export interface IProps {
    boards: IDropdownList[]
    onSubmit: (board: string) => void
    selectedBoard: string
    firmwareVersion: string
}

export const SelectBoard: Component<IProps> = (props) => {
    return (
        <div class="relative w-[285px] p-[24px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]">
            <div class="flex flex-col gap-[10px]">
                <div>
                    <Dropdown>
                        <SelectButton
                            header="Select board"
                            tabIndex={0}
                            type="button"
                            label={!props.selectedBoard ? 'Select board' : props.selectedBoard}
                        />
                        <DropdownList
                            isScrollbar
                            styles="dropdown-content right-[-25px] mt-[38px] p-[12px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26] !w-[285px]"
                            fallbackLabel="Looking for boards!"
                            activeElement={props.selectedBoard}
                            data={props.boards}
                            tabIndex={0}
                            onClick={(data) => {
                                props.onSubmit(data.label)
                            }}
                        />
                    </Dropdown>
                    <div class="pt-[10px] text-left text-[12px] text-white font-normal leading-[16px] not-italic">
                        <div class="flex gap-[4px] items-center">
                            <p>Firmware version:</p>
                            <Show
                                when={props.firmwareVersion}
                                fallback={<span class="loading loading-ring loading-xs" />}>
                                <p>{props.firmwareVersion}</p>
                            </Show>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
