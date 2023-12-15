import { FaSolidXmark } from 'solid-icons/fa'
import { type Component, For, Show } from 'solid-js'
import { Board } from '@components/Board/Board/Board'
import { SelectButton } from '@components/Buttons/SelectButton'

export interface IProps {
    debugMode: string
    debugModes: string[]
    setDebugMode: (debugMode: string) => void
    onClick: () => void
    onClickOpen: () => void

    open: boolean
}

const DebugModeMenu: Component<IProps> = (props) => {
    return (
        <>
            <div
                onClick={(e) => {
                    e.preventDefault()
                    props.onClick()
                }}
                class={'z-10 w-[100vw] h-[100vh] absolute top-0 left-0 bg-black opacity-[0.8]'}
            />
            <div class=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-[350px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                <div class="flex flex-col gap-[14px]">
                    <div class="flex justify-between">
                        <div>
                            <p class="text-left text-[18px] text-white font-[500] leading-[20px] not-italic">
                                Dev tools
                            </p>
                        </div>
                        <div
                            class="cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault()
                                props.onClick()
                            }}>
                            <p class="text-white text-left">
                                <FaSolidXmark size={20} fill="#FFFFFF" />
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-[4px]">
                        <SelectButton
                            type="button"
                            label={!props.debugMode ? 'Select debug mode' : props.debugMode}
                            onClick={() => {
                                props.onClickOpen()
                            }}
                        />
                    </div>
                </div>
                <Show when={props.open}>
                    <div class="z-10 top-[75%] absolute right-0 mt-[34px] w-full p-[12px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]">
                        <div class="overflow-y-scroll max-h-[250px] flex flex-col gap-[10px]">
                            <For each={props.debugModes}>
                                {(data) => (
                                    <Board
                                        board={data}
                                        description={''}
                                        isActive={data === props.debugMode}
                                        onClick={() => {
                                            props.onClickOpen()
                                            props.setDebugMode(data)
                                        }}
                                    />
                                )}
                            </For>
                        </div>
                    </div>
                </Show>
            </div>
        </>
    )
}

export default DebugModeMenu
