import { Component, createSignal, Show } from 'solid-js'
import { BoardList } from '@components/Board/BoardList/Index'
import { Button } from '@components/Buttons/DefaultButton'
import { Footer } from '@components/Footer/Footer'
import { InputField } from '@components/Inputs/InputField/Index'
import { SetupStep } from '@components/Wrappers/SetupStep/Index'
import { HARDWARE_TYPE } from '@interfaces/enums'
import { type IBoardHardware } from '@interfaces/interfaces'
import { ADD_BOARD_LIMIT } from '@src/static'

interface IProps {
    onClickEditBoard: (board: HARDWARE_TYPE, label: string, address: string) => void
    onClickAddBoards: (label: string, address: string) => void
    onClickDeleteBoard: (board: HARDWARE_TYPE) => void
    boards: Array<IBoardHardware>
    onClickOpenDocs: () => void
    onClickConfirm: () => void
    onClickBack: () => void
}

const WizardConfigurator: Component<IProps> = (props) => {
    const [editBoard, setEditBoard] = createSignal<HARDWARE_TYPE | undefined>(undefined)
    const [boardAddress, setBoardAddress] = createSignal('')
    const [boardName, setBoardName] = createSignal('')
    const [error, setError] = createSignal<Record<string, string>>({})

    const onSubmit = () => {
        const currentAddress = boardAddress()
        const currentName = boardName()
        const isEditMode = editBoard()

        setError({})

        const existingBoards = props.boards.filter(
            (board) => !isEditMode || board.hardwareType !== editBoard(),
        )

        const addressExists = existingBoards.some((board) => board.address === currentAddress)
        const nameExists = existingBoards.some((board) => board.label === currentName)

        if (addressExists) {
            setError((prev) => ({ ...prev, address: 'Board with this address already exists' }))
        }
        if (nameExists) {
            setError((prev) => ({
                ...prev,
                label: 'A board with this name already exists. Please choose a unique name.',
            }))
        }

        if (addressExists || nameExists) {
            return
        }

        if (isEditMode) {
            props.onClickEditBoard(isEditMode, currentName, currentAddress)
            setEditBoard(undefined)
        } else {
            props.onClickAddBoards(currentName, currentAddress)
        }

        setBoardAddress('')
        setBoardName('')
    }

    return (
        <div class="pt-[24px] w-full h-full flex flex-col">
            <div class="flex flex-row h-full w-full max-w-[1800px] mx-auto overflow-y-auto scrollbar  max-[1110px]:gap-[12px] min-[1111px]:gap-[64px]">
                <div class="flex flex-row w-full gap-[12px]">
                    <div class="flex flex-col w-full">
                        <SetupStep
                            stepNumber="01"
                            title="Add camera address or port"
                            description="Enter the camera's IP address or port number to connect it to the system. Ensure the address or port is correct for successful communication."
                            isCompleted={boardAddress().length > 0}>
                            <InputField
                                isError={error()?.address}
                                id="cameraAddress"
                                label="Enter the camera address or port number."
                                placeholder="camera address"
                                value={boardAddress()}
                                onInput={(event) => {
                                    const value = event.target.value
                                    setBoardAddress(value.trim())
                                    setError((prev) => {
                                        const newError = { ...prev }
                                        delete newError.address
                                        return newError
                                    })
                                }}
                            />
                        </SetupStep>
                        <SetupStep
                            stepNumber="02"
                            title="Add camera name"
                            description="Choose a name for the camera that will help you easily recognize it within the system. This name should be unique and descriptive for better identification."
                            isCompleted={boardName().length > 0}>
                            <InputField
                                isError={error()?.label}
                                maxWords="16"
                                id="cameraName"
                                label="What would you like to name the camera?"
                                placeholder="camera name"
                                value={boardName()}
                                onInput={(event) => {
                                    const value = event.target.value
                                    if (value.length > 16) {
                                        event.target.value = boardName()
                                        return
                                    }
                                    setBoardName(value.trim())
                                    setError((prev) => {
                                        const newError = { ...prev }
                                        delete newError.label
                                        return newError
                                    })
                                }}
                            />
                        </SetupStep>
                        <SetupStep
                            stepNumber="03"
                            redTitle={
                                props.boards.length >= ADD_BOARD_LIMIT && !editBoard()
                                    ? 'Limit reached'
                                    : undefined
                            }
                            isCompleted={
                                boardName().length > 0 &&
                                boardAddress().length > 0 &&
                                props.boards.length < ADD_BOARD_LIMIT
                            }>
                            <Show
                                when={props.boards.length < ADD_BOARD_LIMIT || editBoard()}
                                fallback={
                                    <p class="not-italic text-white text-[14px] mt-[12px] text-start select-none max-w-[700px] tracking-[0.02em]">
                                        You can add up to two boards in total. Once you've reached
                                        the limit of two, you'll need to remove one if you want to
                                        add a new board.
                                    </p>
                                }>
                                <div class="flex justify-start mt-[24px]">
                                    <div>
                                        <Button
                                            label="Submit"
                                            onClick={onSubmit}
                                            isActive={
                                                boardName().length > 0 && boardAddress().length > 0
                                            }
                                            disabled={!boardName().length || !boardAddress().length}
                                        />
                                    </div>
                                </div>
                            </Show>
                        </SetupStep>
                    </div>
                </div>
                <div class="w-full">
                    <div class="top-0 sticky w-full">
                        <BoardList
                            boards={props.boards}
                            onClickOpenDocs={props.onClickOpenDocs}
                            onDeleteBoard={(board) => {
                                props.onClickDeleteBoard(board.hardwareType)
                            }}
                            onEditBoard={(board) => {
                                setEditBoard(board.hardwareType)
                                setBoardAddress(board.address)
                                setBoardName(board.label)
                            }}
                        />
                    </div>
                </div>
            </div>
            <div class="pt-[12px]">
                <Footer
                    onClickSecond={props.onClickBack}
                    secondLabel="Back"
                    primaryLabel="Confirm"
                    isPrimaryActive={props.boards.length >= 1 ? false : true}
                    isPrimaryButtonDisabled={!props.boards.length}
                    onClickPrimary={() => {
                        props.onClickConfirm()
                    }}
                />
            </div>
        </div>
    )
}

export default WizardConfigurator
