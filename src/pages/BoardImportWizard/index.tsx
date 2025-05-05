import Button from '@components/Buttons/Button'
import { Footer } from '@components/Footer'
import { InputField } from '@components/Inputs/InputField'
import Typography from '@components/Typography'
import StepWrapper from '@components/Wrapper/StepWrapper'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { sleep } from '@src/utils'
import { useFormHandler } from 'solid-form-handler'
import { yupSchema } from 'solid-form-handler/yup'
import { Component, createMemo, createSignal, Match, Show, Switch } from 'solid-js'
import { v6 as uuidV6 } from 'uuid'
import CheckCameraCalibration from './CheckCameraCalibration'
import CheckServerStatus from './CheckServerStatus'
import { trackerSchema } from './schema'
import { ITracker } from '@interfaces/trackers/interfaces'

export enum SETUP_TRACKER {
    SETUP_LEFT_TRACKER = 'SETUP_LEFT_TRACKER',
    SETUP_RIGHT_TRACKER = 'SETUP_RIGHT_TRACKER',
    CHECK_SERVER_STATUS = 'CHECK_SERVER_STATUS',
    CHECK_CONNECTION = 'CHECK_CONNECTION',
}

interface IProps {
    onClickAddTrackers: (board: ITracker[]) => void
    checkServerStatus: () => Promise<CONNECTION_STATUS>
    updateTrackersConfig: (board: ITracker[]) => Promise<Record<TRACKER_POSITION, string>>
    onClickOpenDocs: () => void
    onClickBack: () => void
    serverStatus: CONNECTION_STATUS
    loader: boolean
}

const BoardImportWizard: Component<IProps> = (props) => {
    const [calibrationCompleted, setCalibrationCompleted] = createSignal<boolean>(false)
    const [step, setStep] = createSignal<SETUP_TRACKER>(SETUP_TRACKER.SETUP_LEFT_TRACKER)
    const [rightTracker, setRightTracker] = createSignal<ITracker | undefined>(undefined)
    const [leftTracker, setLeftTracker] = createSignal<ITracker | undefined>(undefined)
    const [isLoading, setIsLoading] = createSignal<boolean>(false)
    const [stepIndex, setStepIndex] = createSignal<number>(0)
    const [trackersStream, setTrackersStream] = createSignal<Record<TRACKER_POSITION, string>>({
        [TRACKER_POSITION.LEFT_EYE]: '',
        [TRACKER_POSITION.RIGHT_EYE]: '',
    })
    const [serverStatus, setServerStatus] = createSignal<CONNECTION_STATUS>(
        CONNECTION_STATUS.INACTIVE,
    )

    const formHandler = useFormHandler(yupSchema(trackerSchema))

    const progressbarStep = createMemo(() => ({
        [SETUP_TRACKER.SETUP_LEFT_TRACKER]: 1,
        [SETUP_TRACKER.SETUP_RIGHT_TRACKER]: 2,
        [SETUP_TRACKER.CHECK_SERVER_STATUS]: 3,
        [SETUP_TRACKER.CHECK_CONNECTION]: 4,
    }))

    const buttonLabel = createMemo(() => ({
        [SETUP_TRACKER.SETUP_LEFT_TRACKER]: 'Setup left tracker',
        [SETUP_TRACKER.SETUP_RIGHT_TRACKER]: 'Setup right tracker',
        [SETUP_TRACKER.CHECK_SERVER_STATUS]: 'Establishing connection',
        [SETUP_TRACKER.CHECK_CONNECTION]: 'I Connected all my boards',
    }))

    const trackerPosition = createMemo(() => ({
        [SETUP_TRACKER.SETUP_LEFT_TRACKER]: TRACKER_POSITION.LEFT_EYE,
        [SETUP_TRACKER.SETUP_RIGHT_TRACKER]: TRACKER_POSITION.RIGHT_EYE,
        [SETUP_TRACKER.CHECK_SERVER_STATUS]: undefined,
        [SETUP_TRACKER.CHECK_CONNECTION]: undefined,
    }))

    const trackerData = createMemo(() => ({
        [SETUP_TRACKER.SETUP_LEFT_TRACKER]: leftTracker(),
        [SETUP_TRACKER.SETUP_RIGHT_TRACKER]: rightTracker(),
    }))

    const cameraLabelDescription = createMemo(() => {
        switch (step()) {
            case SETUP_TRACKER.SETUP_LEFT_TRACKER:
                return 'Setup left tracker'
            case SETUP_TRACKER.SETUP_RIGHT_TRACKER:
                return 'Setup right tracker'
            default:
                return ''
        }
    })

    const trackers = createMemo(() => {
        const data = [leftTracker(), rightTracker()].filter((tracker) => !!tracker)
        return data.map((data) => ({
            ...data,
            streamSource: trackersStream()[data.trackerPosition] ?? '',
        }))
    })

    const hidePrimaryButton = createMemo(() => {
        const tracker = trackerData()[step()]
        if (!trackers().length && step() === SETUP_TRACKER.SETUP_RIGHT_TRACKER) {
            return false
        }

        return (
            step() !== SETUP_TRACKER.CHECK_CONNECTION &&
            !formHandler.getFieldValue('address').length &&
            !formHandler.getFieldValue('label').length &&
            !formHandler.getFormErrors().length &&
            !tracker
        )
    })

    const isPrimaryButtonActive = createMemo(() => {
        if (props.loader) return false
        return (
            (step() !== SETUP_TRACKER.CHECK_CONNECTION &&
                formHandler.getFieldValue('label').length > 0 &&
                formHandler.getFieldValue('address').length > 0 &&
                !formHandler.getFormErrors().length) ||
            (step() === SETUP_TRACKER.CHECK_CONNECTION && calibrationCompleted())
        )
    })

    const isPrimaryButtonDisabled = createMemo(() => {
        if (props.loader) return true

        return (
            (step() !== SETUP_TRACKER.CHECK_CONNECTION &&
                (!formHandler.getFieldValue('address').length ||
                    !formHandler.getFieldValue('label').length ||
                    formHandler.getFormErrors().length > 0)) ||
            (step() === SETUP_TRACKER.CHECK_CONNECTION && !calibrationCompleted())
        )
    })

    const loadTrackerState = (currentStep: SETUP_TRACKER) => {
        switch (currentStep) {
            case SETUP_TRACKER.SETUP_LEFT_TRACKER: {
                const tracker = leftTracker()
                if (tracker) {
                    formHandler.setFieldValue('address', tracker.address || '')
                    formHandler.setFieldValue('label', tracker.label || '')
                } else {
                    formHandler.resetForm()
                }
                break
            }
            case SETUP_TRACKER.SETUP_RIGHT_TRACKER: {
                const tracker = rightTracker()
                if (tracker) {
                    formHandler.setFieldValue('address', tracker.address || '')
                    formHandler.setFieldValue('label', tracker.label || '')
                } else {
                    formHandler.resetForm()
                }
                break
            }
            default:
                break
        }
    }
    const setupAndValidateTrackerConnections = async () => {
        setCalibrationCompleted(false)
        setIsLoading(true)
        setTrackersStream({
            [TRACKER_POSITION.RIGHT_EYE]: '',
            [TRACKER_POSITION.LEFT_EYE]: '',
        })

        const trackersStream = await props.updateTrackersConfig(trackers())
        setTrackersStream(trackersStream)

        await establishConnection()
        setCalibrationCompleted(true)
        setNextStep()
    }

    const setNextStep = () => {
        const steps = Object.keys(progressbarStep()) as unknown as SETUP_TRACKER[]
        const step: SETUP_TRACKER | undefined = steps[stepIndex() + 1]
        if (!step) return

        if (step === SETUP_TRACKER.CHECK_SERVER_STATUS) {
            setupAndValidateTrackerConnections().catch(() => {})
        }

        setStepIndex(stepIndex() + 1)
        setStep(step)
        loadTrackerState(step)
    }

    const setPreviousStep = () => {
        const steps = Object.keys(progressbarStep()) as unknown as SETUP_TRACKER[]
        let index = stepIndex() - 1

        let previousStep: SETUP_TRACKER | undefined = steps[index]
        if (previousStep === SETUP_TRACKER.CHECK_SERVER_STATUS) {
            previousStep = SETUP_TRACKER.SETUP_RIGHT_TRACKER
            index = 1
        }

        if (!previousStep) {
            props.onClickBack()
            return
        }

        loadTrackerState(previousStep)
        setStepIndex(index)
        setStep(previousStep)
    }

    const establishConnection = async () => {
        setServerStatus(CONNECTION_STATUS.CONNECTING)
        setIsLoading(true)

        const status = await props.checkServerStatus()
        await sleep(1000)

        setServerStatus(status)
        setIsLoading(false)
    }

    const handleFormSubmit = async (e: Event) => {
        e.preventDefault()
        const tracker = trackerPosition()[step()]
        if (!tracker) return

        try {
            await formHandler.validateForm()
            const trackerConfig: ITracker = {
                label: formHandler.getFieldValue('label'),
                address: formHandler.getFieldValue('address'),
                trackerPosition: tracker,
                streamSource: '',
                id: uuidV6(),
            }

            switch (step()) {
                case SETUP_TRACKER.SETUP_LEFT_TRACKER:
                    setLeftTracker(trackerConfig)
                    break
                case SETUP_TRACKER.SETUP_RIGHT_TRACKER:
                    setRightTracker(trackerConfig)
                    break
                default:
                    break
            }

            formHandler.resetForm()
            setNextStep()
        } catch {}
    }

    return (
        <div class="pt-24 w-full h-full flex flex-col justify-start items-center px-24">
            <div class="w-full h-full flex flex-col justify-center items-center relative bottom-[30px]">
                <div class="flex flex-row min-[900px]:gap-64 gap-12 w-full justify-center">
                    <div class="flex flex-col h-full gap-6 min-h-[400px]">
                        <StepWrapper
                            isActive={stepIndex() > 0}
                            label="Setup left tracker"
                            description="Enter left tracker details"
                            step="1"
                        />
                        <StepWrapper
                            isActive={stepIndex() > 1}
                            label="Setup right tracker"
                            description="Enter right tracker details"
                            step="2"
                        />
                        <StepWrapper
                            isActive={stepIndex() > 2}
                            label="Check server connection"
                            description="validate server status"
                            step="3"
                        />

                        <StepWrapper
                            isActive={calibrationCompleted()}
                            label="check tracker connection"
                            description="validate tracker connection"
                            hideDots
                            step="4"
                        />
                    </div>
                    <form
                        class="flex flex-col gap-64 items-start w-full justify-between max-w-[700px]"
                        onSubmit={handleFormSubmit}>
                        <Switch>
                            <Match
                                when={
                                    step() === SETUP_TRACKER.SETUP_LEFT_TRACKER ||
                                    step() === SETUP_TRACKER.SETUP_RIGHT_TRACKER
                                }>
                                <div class="flex flex-col gap-24 items-start w-full min-h-[500px]">
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
                                                Enter the unique address or port number that
                                                identifies this camera on your network. This
                                                information is necessary for establishing a
                                                connection.
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
                            <Match when={step() === SETUP_TRACKER.CHECK_SERVER_STATUS}>
                                <CheckServerStatus
                                    connectionFailed={serverStatus() === CONNECTION_STATUS.FAILED}
                                    onClick={establishConnection}
                                />
                            </Match>
                            <Match when={step() === SETUP_TRACKER.CHECK_CONNECTION}>
                                <CheckCameraCalibration
                                    trackerStream={trackersStream()}
                                    rightTrackerAddress={rightTracker()?.address ?? '--'}
                                    leftTrackerAddress={leftTracker()?.address ?? '--'}
                                    rightTrackerLabel={rightTracker()?.label ?? '--'}
                                    leftTrackerLabel={leftTracker()?.label ?? '--'}
                                />
                            </Match>
                        </Switch>
                        <div class="flex flex-row justify-end items-end w-full gap-12">
                            <Footer
                                onClickPrimaryButton={() => {
                                    if (
                                        step() === SETUP_TRACKER.CHECK_CONNECTION &&
                                        calibrationCompleted()
                                    ) {
                                        props.onClickAddTrackers(trackers())
                                    }
                                }}
                                hidePrimaryButton={hidePrimaryButton()}
                                onClickSecondaryButton={setPreviousStep}
                                primaryButtonLabel={buttonLabel()[step()] ?? 'Next step'}
                                isSecondaryButtonDisabled={isLoading()}
                                secondaryButtonLabel="Previous step"
                                secondaryButtonType="button"
                                primaryButtonType={hidePrimaryButton() ? 'button' : 'submit'}
                                isPrimaryButtonActive={isPrimaryButtonActive()}
                                isPrimaryButtonDisabled={isPrimaryButtonDisabled()}
                            />
                            <Show when={hidePrimaryButton()}>
                                <Button
                                    disabled={isLoading() || props.loader}
                                    label="Skip step"
                                    type="button"
                                    onClick={setNextStep}
                                />
                            </Show>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BoardImportWizard
