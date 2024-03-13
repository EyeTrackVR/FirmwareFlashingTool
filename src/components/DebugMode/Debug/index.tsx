import { FaSolidXmark } from 'solid-icons/fa'
import { type Component, For } from 'solid-js'
import { Board } from '@components/Board/Board/Board'
import { SelectButton } from '@components/Buttons/SelectButton'

export interface IProps {
    debugMode: string
    debugModes: string[]
    setDebugMode: (debugMode: string) => void
}

const DebugModeMenu: Component<IProps> = (props) => {
    return (
        <div class="w-[350px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
            <div class="flex flex-col gap-[14px]">
                <div class="flex justify-between">
                    <div>
                        <p class="text-left text-[18px] text-white font-medium leading-[20px] not-italic">
                            Dev tools
                        </p>
                    </div>
                    <div class="modal-action mt-0">
                        <form method="dialog">
                            <button class="cursor-pointer p-[4px] rounded-full border border-solid border-[#0D1B26] focus-visible:border-[#9793FD]">
                                <p class="text-white text-left">
                                    <FaSolidXmark size={20} fill="#FFFFFF" />
                                </p>
                            </button>
                        </form>
                    </div>
                </div>
                <div class="dropdown w-full flex flex-col gap-[8px]">
                    <div>
                        <p class="text-left text-[14px] text-white font-normal leading-[20px] not-italic">
                            Debug mode
                        </p>
                    </div>
                    <div>
                        <SelectButton
                            tabIndex={0}
                            type="button"
                            label={!props.debugMode ? 'Select debug mode' : props.debugMode}
                        />
                        <div
                            tabIndex={0}
                            class="dropdown-content right-[-13px] mt-[20px] p-[12px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]  w-[350px]">
                            <div class="overflow-y-scroll max-h-[250px] flex flex-col gap-[10px]">
                                <For each={props.debugModes}>
                                    {(data) => (
                                        <Board
                                            board={data}
                                            isActive={data === props.debugMode}
                                            onClick={() => {
                                                props.setDebugMode(data)
                                            }}
                                        />
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DebugModeMenu
