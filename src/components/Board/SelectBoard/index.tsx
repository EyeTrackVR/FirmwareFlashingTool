import { SelectButton } from '@components/Buttons/SelectButton'
import Dropdown from '@components/Dropdown/Dropdown'
import DropdownList from '@components/Dropdown/DropdownList'
import Typography from '@components/Typography'
import { type IDropdownList } from '@interfaces/interfaces'
import { Component, Show } from 'solid-js'

export interface IProps {
    boards: IDropdownList[]
    onSubmit: (board: string) => void
    selectedBoard: string
    firmwareVersion: string
}

export const SelectBoard: Component<IProps> = (props) => {
    return (
        <div class="relative w-[300px] p-24 rounded-12 border border-solid border-black-800 bg-black-900">
            <div class="flex flex-col gap-8">
                <Dropdown>
                    <SelectButton
                        header="Select board"
                        tabIndex={0}
                        type="button"
                        label={!props.selectedBoard ? 'Select board' : props.selectedBoard}
                    />
                    <DropdownList
                        isScrollbar
                        styles="dropdown-content right-[-25px] mt-38 p-12 rounded-12 border border-solid border-black-800 bg-black-900 !w-[300px]"
                        fallbackLabel="Looking for boards!"
                        activeElement={props.selectedBoard}
                        data={props.boards}
                        tabIndex={0}
                        onClick={(data) => {
                            props.onSubmit(data.label)
                        }}
                    />
                </Dropdown>
                <div class="flex gap-4 items-center">
                    <Typography color="white" text="small">
                        Firmware version:
                    </Typography>
                    <Show
                        when={props.firmwareVersion}
                        fallback={<span class="loading loading-ring w-12 h-12" />}>
                        <Typography color="white" text="small">
                            {props.firmwareVersion}
                        </Typography>
                    </Show>
                </div>
            </div>
        </div>
    )
}
