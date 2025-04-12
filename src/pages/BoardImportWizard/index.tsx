import { Footer } from '@components/Footer'
import { InputField } from '@components/Inputs/InputField'
import Typography from '@components/Typography'
import StepWrapper from '@components/Wrapper/StepWrapper'
import { TRACKER_POSITION } from '@interfaces/boards/enums'
import { IBoard } from '@interfaces/boards/interfaces'
import { useFormHandler } from 'solid-form-handler'
import { yupSchema } from 'solid-form-handler/yup'
import { Accessor, Component, createMemo, createSignal, Match, Switch } from 'solid-js'
import { v6 as uuidV6 } from 'uuid'
import { boardSchema } from './schema'

export enum SETUP_BOARD {
    SETUP_LEFT_CAMERA = 'SETUP_LEFT_CAMERA',
    SETUP_RIGHT_CAMERA = 'SETUP_RIGHT_CAMERA',
    CHECK_CONNECTION = 'CHECK_CONNECTION',
}

interface IProps {
    onClickAddBoards: (board: IBoard[]) => void
    onClickOpenDocs: () => void
    onClickBack: () => void
    boards: Array<IBoard>
}

const BoardImportWizard: Component<IProps> = (props) => {
    const [calibrationCompleted, setCalibrationCompleted] = createSignal<boolean>(true) // coming soon
    const [step, setStep] = createSignal<SETUP_BOARD>(SETUP_BOARD.SETUP_LEFT_CAMERA)
    const [rightBoard, setRightBoard] = createSignal<IBoard | undefined>(undefined)
    const [leftBoard, setLeftBoard] = createSignal<IBoard | undefined>(undefined)
    const [stepIndex, setStepIndex] = createSignal<number>(0)
    const formHandler = useFormHandler(yupSchema(boardSchema))

    const progressbarStep: Accessor<Record<SETUP_BOARD, number>> = createMemo(() => {
        return {
            [SETUP_BOARD.SETUP_LEFT_CAMERA]: 1,
            [SETUP_BOARD.SETUP_RIGHT_CAMERA]: 2,
            [SETUP_BOARD.CHECK_CONNECTION]: 3,
        }
    })

    const buttonLabel: Accessor<Record<SETUP_BOARD, string>> = createMemo(() => {
        return {
            [SETUP_BOARD.SETUP_LEFT_CAMERA]: 'Setup left board',
            [SETUP_BOARD.SETUP_RIGHT_CAMERA]: 'Setup right board',
            [SETUP_BOARD.CHECK_CONNECTION]: 'I Connected all my boards',
        }
    })

    const trackerPosition: Accessor<Record<SETUP_BOARD, TRACKER_POSITION | undefined>> = createMemo(
        () => ({
            [SETUP_BOARD.SETUP_LEFT_CAMERA]: TRACKER_POSITION.LEFT_TRACKER,
            [SETUP_BOARD.SETUP_RIGHT_CAMERA]: TRACKER_POSITION.RIGHT_TRACKER,
            [SETUP_BOARD.CHECK_CONNECTION]: undefined,
        }),
    )

    const setNextStep = () => {
        const steps = Object.keys(progressbarStep()) as unknown as SETUP_BOARD[]
        const currentStep: SETUP_BOARD | undefined = steps[stepIndex() + 1]
        if (!currentStep) return
        setStepIndex(stepIndex() + 1)
        setStep(currentStep)
    }

    const loadBoardState = (step: SETUP_BOARD) => {
        switch (step) {
            case SETUP_BOARD.SETUP_LEFT_CAMERA: {
                if (typeof leftBoard() !== 'undefined') {
                    formHandler.setFieldValue('address', leftBoard()?.address ?? '')
                    formHandler.setFieldValue('label', leftBoard()?.label ?? '')
                }
                break
            }
            case SETUP_BOARD.SETUP_RIGHT_CAMERA: {
                if (typeof rightBoard() !== 'undefined') {
                    formHandler.setFieldValue('address', rightBoard()?.address ?? '')
                    formHandler.setFieldValue('label', rightBoard()?.label ?? '')
                }
                break
            }
            default:
                break
        }
    }

    const cameraLabelDescription = createMemo(() => {
        switch (step()) {
            case SETUP_BOARD.SETUP_LEFT_CAMERA:
                return 'Setup left board'
            case SETUP_BOARD.SETUP_RIGHT_CAMERA:
                return 'Setup right board'
            default:
                return ''
        }
    })

    return (
        <div class="pt-24 w-full h-full flex flex-col justify-start items-center px-24">
            <div class="w-full h-full flex flex-col justify-center items-center relative bottom-[30px]">
                <div class="flex flex-row min-[900px]:gap-64 gap-12 w-full justify-center">
                    <div class="flex flex-col h-full gap-6 min-h-[400px]">
                        <StepWrapper
                            isActive={stepIndex() > 0}
                            label="Setup left board"
                            description="Enter left board details"
                            step="1"
                        />
                        <StepWrapper
                            isActive={stepIndex() > 1}
                            label="Setup right board"
                            description="Enter right board details"
                            step="2"
                        />
                        <StepWrapper
                            isActive={calibrationCompleted()}
                            label="check board connection"
                            description="validate board connection"
                            hideDots
                            step="3"
                        />
                    </div>
                    <form
                        class="flex flex-col gap-64 items-start w-full justify-between max-w-[700px]"
                        onSubmit={async (e) => {
                            e.preventDefault()
                            const tracker = trackerPosition()[step()]
                            if (!tracker) return
                            try {
                                await formHandler.validateForm()
                                const board: IBoard = {
                                    label: formHandler.getFieldValue('label'),
                                    address: formHandler.getFieldValue('address'),
                                    TrackerPosition: tracker,
                                    id: uuidV6(),
                                }
                                switch (step()) {
                                    case SETUP_BOARD.SETUP_LEFT_CAMERA:
                                        setLeftBoard(board)
                                        break
                                    case SETUP_BOARD.SETUP_RIGHT_CAMERA:
                                        setRightBoard(board)
                                        break
                                    default:
                                        break
                                }
                                formHandler.resetForm()
                                setNextStep()
                                loadBoardState(step())
                            } catch {}
                        }}>
                        <Switch>
                            <Match when={step() !== SETUP_BOARD.CHECK_CONNECTION}>
                                <div class="flex flex-col gap-24 items-start w-full">
                                    <Typography color="lightGrey" text="h3">
                                        {cameraLabelDescription()}
                                    </Typography>
                                    <div class="flex flex-col gap-24 items-start w-full">
                                        <div class="flex flex-col gap-12 text-left">
                                            <Typography color="white" text="caption">
                                                Add camera name
                                            </Typography>
                                            <Typography
                                                color="white"
                                                text="caption"
                                                class="text-left">
                                                Choose a name for the camera that will help you
                                                easily recognize it within the system. This name
                                                should be unique and descriptive for better
                                                identification.
                                            </Typography>
                                        </div>
                                        <div class="w-full flex flex-col gap-6">
                                            <InputField
                                                label="What would you like to name the camera?"
                                                isError={formHandler.getFieldError('label')}
                                                value={formHandler.getFieldValue('label')}
                                                placeholder="camera name"
                                                id="cameraName"
                                                maxWords="16"
                                                onInput={(event) => {
                                                    const value = event.target.value
                                                    if (value.length > 16) {
                                                        event.target.value =
                                                            formHandler.getFieldValue('label')
                                                        return
                                                    }
                                                    formHandler.setFieldValue('label', value.trim())
                                                }}
                                            />
                                            <div class="h-16">
                                                <Typography
                                                    color="red"
                                                    text="caption"
                                                    class="text-left">
                                                    {formHandler.getFieldError('label')}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-24 items-start w-full">
                                        <div class="flex flex-col gap-12 text-left">
                                            <Typography color="white" text="caption">
                                                Add camera name
                                            </Typography>
                                            <Typography
                                                color="white"
                                                text="caption"
                                                class="text-left">
                                                Choose a name for the camera that will help you
                                                easily recognize it within the system. This name
                                                should be unique and descriptive for better
                                                identification.
                                            </Typography>
                                        </div>
                                        <div class="w-full flex flex-col gap-6">
                                            <InputField
                                                label="Enter the camera address or port number."
                                                isError={formHandler.getFieldError('address')}
                                                value={formHandler.getFieldValue('address')}
                                                placeholder="camera address"
                                                id="address"
                                                onInput={(event) => {
                                                    formHandler.setFieldValue(
                                                        'address',
                                                        event.target.value.trim(),
                                                    )
                                                }}
                                            />
                                            <div class="h-16">
                                                <Typography
                                                    color="red"
                                                    text="caption"
                                                    class="text-left">
                                                    {formHandler.getFieldError('address')}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Match>
                            <Match when={step() === SETUP_BOARD.CHECK_CONNECTION}>
                                <div class="flex flex-col gap-24 items-start w-full">
                                    <div class="flex flex-col gap-24 items-start w-full">
                                        <Typography color="white" text="caption">
                                            Check camera calibration
                                        </Typography>
                                        <Typography color="white" text="caption" class="text-left">
                                            Coming Soon
                                        </Typography>
                                    </div>
                                </div>
                            </Match>
                        </Switch>
                        <Footer
                            onClickPrimaryButton={() => {
                                const leftTracker = leftBoard()
                                const rightTracker = rightBoard()
                                if (
                                    step() === SETUP_BOARD.CHECK_CONNECTION &&
                                    calibrationCompleted() &&
                                    typeof leftTracker !== 'undefined' &&
                                    typeof rightTracker !== 'undefined'
                                ) {
                                    props.onClickAddBoards([leftTracker, rightTracker])
                                }
                            }}
                            onClickSecondaryButton={() => {
                                const steps = Object.keys(
                                    progressbarStep(),
                                ) as unknown as SETUP_BOARD[]
                                const previousStep: SETUP_BOARD | undefined = steps[stepIndex() - 1]
                                if (!previousStep) {
                                    props.onClickBack()
                                    return
                                }
                                loadBoardState(previousStep)
                                setStepIndex(stepIndex() - 1)
                                setStep(previousStep)
                            }}
                            primaryButtonLabel={buttonLabel()?.[step()] ?? 'Next step'}
                            secondaryButtonLabel="Previous step"
                            secondaryButtonType="button"
                            primaryButtonType="submit"
                            isPrimaryButtonActive={
                                (step() !== SETUP_BOARD.CHECK_CONNECTION &&
                                    formHandler.getFieldValue('label').length > 0 &&
                                    formHandler.getFieldValue('address').length > 0 &&
                                    !formHandler.getFormErrors().length) ||
                                (step() === SETUP_BOARD.CHECK_CONNECTION && calibrationCompleted())
                            }
                            isPrimaryButtonDisabled={
                                (step() !== SETUP_BOARD.CHECK_CONNECTION &&
                                    (!formHandler.getFieldValue('address').length ||
                                        !formHandler.getFieldValue('label').length ||
                                        formHandler.getFormErrors().length > 0)) ||
                                (step() === SETUP_BOARD.CHECK_CONNECTION && !calibrationCompleted())
                            }
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BoardImportWizard
