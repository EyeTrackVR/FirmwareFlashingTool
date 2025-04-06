import { BoardList } from '@components/Board/BoardList'
import Button from '@components/Buttons/Button'
import { Footer } from '@components/Footer'
import { InputField } from '@components/Inputs/InputField'
import Typography from '@components/Typography'
import { StepWrapper } from '@components/Wrapper/StepWrapper'
import { IBoard } from '@interfaces/boards/interfaces'
import { ADD_BOARD_LIMIT } from '@src/static'
import { useFormHandler } from 'solid-form-handler'
import { yupSchema } from 'solid-form-handler/yup'
import { Component, createMemo, createSignal, Show } from 'solid-js'
import { boardSchema } from './schema'
import { v6 as uuidV6 } from 'uuid'

interface IProps {
    onClickEditBoard: (id: string, label: string, address: string) => void
    onClickAddBoard: (label: string, address: string, id: string) => void
    onClickDeleteBoard: (board: string) => void
    boards: Array<IBoard>
    onClickOpenDocs: () => void
    onClickConfirm: () => void
    onClickBack: () => void
}

const BoardImportWizard: Component<IProps> = (props) => {
    const [editBoard, setEditBoard] = createSignal<string | undefined>(undefined)
    const formHandler = useFormHandler(
        yupSchema(boardSchema(props.boards, typeof editBoard() !== 'undefined')),
    )

    const isDisabled = createMemo(() => {
        return (
            !formHandler.getFieldValue('address').length ||
            !formHandler.getFieldValue('label').length ||
            formHandler.getFormErrors().length > 0
        )
    })

    const isActive = createMemo(() => {
        return (
            formHandler.getFieldValue('label').length > 0 &&
            formHandler.getFieldValue('address').length > 0 &&
            !formHandler.getFormErrors().length
        )
    })

    const isCompleted = createMemo(() => {
        return (
            formHandler.getFieldValue('label').length > 0 &&
            formHandler.getFieldValue('address').length > 0 &&
            !formHandler.getFormErrors().length &&
            props.boards.length < ADD_BOARD_LIMIT
        )
    })

    const buttonType = createMemo(() => (!isDisabled() ? 'submit' : 'button'))
    const isLimitReached = createMemo(() =>
        props.boards.length >= ADD_BOARD_LIMIT && !editBoard() ? 'Limit reached' : undefined,
    )

    return (
        <div class="pt-24 w-full h-full flex flex-col">
            <div class="flex flex-row h-full w-full max-w-[1800px] mx-auto overflow-y-auto scrollbar max-[1110px]:gap-12 min-[1111px]:gap-[64px]">
                <form
                    class="flex flex-row w-full gap-12"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        try {
                            await formHandler.validateForm()
                            if (editBoard()) {
                                props.onClickEditBoard(
                                    uuidV6(),
                                    formHandler.getFieldValue('label'),
                                    formHandler.getFieldValue('address'),
                                )
                                setEditBoard(undefined)
                            } else {
                                props.onClickAddBoard(
                                    formHandler.getFieldValue('label'),
                                    formHandler.getFieldValue('address'),
                                    uuidV6(),
                                )
                            }
                            formHandler.resetForm()
                        } catch {}
                    }}>
                    <div class="flex flex-col w-full">
                        <StepWrapper
                            stepNumber="01"
                            title="Add camera address or port"
                            description="Enter the camera's IP address or port number to connect it to the system. Ensure the address or port is correct for successful communication."
                            isCompleted={formHandler.getFieldValue('address').length > 0}>
                            <div class="flex flex-col gap-12 pb-32">
                                <InputField
                                    isError={formHandler.getFieldError('address')}
                                    value={formHandler.getFieldValue('address')}
                                    label="Enter the camera address or port number."
                                    placeholder="camera address"
                                    id="address"
                                    onInput={(event) => {
                                        formHandler.setFieldValue('address', event.target.value)
                                    }}
                                />
                                <Typography color="red" text="caption" class="text-left h-16">
                                    {formHandler.getFieldError('address')}
                                </Typography>
                            </div>
                        </StepWrapper>
                        <StepWrapper
                            stepNumber="02"
                            title="Add camera name"
                            description="Choose a name for the camera that will help you easily recognize it within the system. This name should be unique and descriptive for better identification."
                            isCompleted={formHandler.getFieldValue('label').length > 0}>
                            <div class="flex flex-col gap-12 pb-32">
                                <InputField
                                    isError={formHandler.getFieldError('label')}
                                    value={formHandler.getFieldValue('label')}
                                    label="What would you like to name the camera?"
                                    placeholder="camera name"
                                    id="cameraName"
                                    maxWords="16"
                                    onInput={(event) => {
                                        const value = event.target.value
                                        if (value.length > 16) {
                                            event.target.value = formHandler.getFieldValue('label')
                                            return
                                        }
                                        formHandler.setFieldValue('label', value)
                                    }}
                                />
                                <Typography color="red" text="caption" class="text-left h-16">
                                    {formHandler.getFieldError('label')}
                                </Typography>
                            </div>
                        </StepWrapper>
                        <StepWrapper
                            stepNumber="03"
                            hideDots
                            error={isLimitReached()}
                            isCompleted={isCompleted()}>
                            <Show
                                when={props.boards.length < ADD_BOARD_LIMIT || editBoard()}
                                fallback={
                                    <Typography
                                        color="white"
                                        text="caption"
                                        class="text-left mt-24">
                                        You can add up to two boards in total. Once you've reached
                                        the limit of two, you'll need to remove one if you want to
                                        add a new board.
                                    </Typography>
                                }>
                                <div class="flex justify-start mt-24">
                                    <div>
                                        <Button
                                            label="Submit"
                                            type={buttonType()}
                                            isActive={isActive()}
                                            disabled={isDisabled()}
                                        />
                                    </div>
                                </div>
                            </Show>
                        </StepWrapper>
                    </div>
                </form>
                <div class="w-full">
                    <div class="top-0 sticky w-full">
                        <BoardList
                            onClickOpenDocs={props.onClickOpenDocs}
                            boards={props.boards}
                            onDeleteBoard={(board) => {
                                props.onClickDeleteBoard(board.id)
                            }}
                            onEditBoard={(board) => {
                                setEditBoard(board.id)
                                formHandler.setFieldValue('label', board.label)
                                formHandler.setFieldValue('address', board.address)
                            }}
                        />
                    </div>
                </div>
            </div>
            <div class="pt-12">
                <Footer
                    onClickSecond={props.onClickBack}
                    secondLabel="Previous step"
                    primaryLabel="I Connected all my boards"
                    isPrimaryActive={!props.boards.length}
                    isButtonDisabled={!props.boards.length}
                    isPrimaryButtonDisabled={!props.boards.length}
                    onClickPrimary={() => {
                        props.onClickConfirm()
                    }}
                />
            </div>
        </div>
    )
}

export default BoardImportWizard
