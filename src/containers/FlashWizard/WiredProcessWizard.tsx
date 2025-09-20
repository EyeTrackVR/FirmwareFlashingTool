import Card from '@components/Cards/Card'
import Input from '@components/Inputs/Input'
import Typography from '@components/Typography'
import {
    ACTION,
    FLASH_WIZARD_STEPS,
    INIT_WIZARD_STEPS,
    WIRED_WIZARD_STEPS,
} from '@interfaces/enums'
import { getApi } from '@src/esp'
import { shortMdnsAddress } from '@src/utils'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { VsDeviceCameraVideo } from 'solid-icons/vs'
import { batch, createSignal, Match, Switch } from 'solid-js'

const WiredProcessWizard = () => {
    const { trackerName, setTrackerName, activePort } = useAppAPIContext()
    const [isPendingUpdate, setIsPendingUpdate] = createSignal(false)
    const [error, setError] = createSignal('')

    return (
        <Switch>
            <Match when={activeStep() === WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_NAME}>
                <Card
                    secondaryButtonLabel="Wi-Fi mode"
                    onClickOptionLabel="Wired Mode"
                    label="Setup tracker name"
                    primaryButtonLabel="Setup Tracker"
                    isActive={trackerName().trim().length > 3 && trackerName().trim().length <= 15}
                    icon={VsDeviceCameraVideo}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_MODE)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_PROCESS)
                            setIsPendingUpdate(true)
                            setAction(ACTION.NEXT)
                            setError('')
                        })
                        getApi()
                            .setupWiredConnection(trackerName(), activePort().activePortName)
                            .then(() => {
                                batch(() => {
                                    setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_PROCESS_SUCCESS)
                                    setAction(ACTION.NEXT)
                                })
                            })
                            .catch((err) => {
                                batch(() => {
                                    setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_PROCESS_FAILED)
                                    setAction(ACTION.NEXT)
                                    setError(err.message)
                                })
                            })
                            .finally(() => {
                                setIsPendingUpdate(false)
                            })
                    }}>
                    <Typography color="blue" text="caption" class="leading-[18px]">
                        The tracker will be accessible under:
                        <br />
                        <code class="text-purple-100">
                            (
                            {!trackerName().trim().length
                                ? '----'
                                : shortMdnsAddress(trackerName())}
                            )
                        </code>
                    </Typography>
                    <div class="flex flex-col gap-10 w-full">
                        <Typography color="white" text="caption" class="text-left">
                            Tracker name
                        </Typography>
                        <Input
                            id="trackerName"
                            required={true}
                            autoFocus={true}
                            type="text"
                            onChange={(name) => {
                                if (/[^A-Za-z\d]/.test(name)) return
                                let cleanedName = name.replace(/^\s+/, '').replace(/\s+/g, ' ')
                                setTrackerName(cleanedName)
                            }}
                            placeholder="Enter your wifi name"
                            value={trackerName()}
                        />
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_PROCESS}>
                <Card
                    label="Setup tracker name"
                    primaryButtonLabel="Continue"
                    isLoader
                    icon={BiRegularLoaderAlt}
                    onClickBack={() => {
                        if (isPendingUpdate()) return
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_NAME)
                        })
                    }}
                    onClickPrimary={() => {}}>
                    <Typography color="white" text="caption" class="leading-[18px]">
                        Switching to wired mode… The device will now appear as a UVC camera. with an
                        additional COM port for communication
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_PROCESS_SUCCESS}>
                <Card
                    status="success"
                    secondaryButtonLabel="Return to the beginning"
                    isActive
                    icon={IoCheckmarkSharp}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_NAME)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(INIT_WIZARD_STEPS.PROCESS_INIT)
                        })
                    }}
                    label="Its done!"
                    description="Your device is set up and ready to go."
                />
            </Match>
            <Match when={activeStep() === WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_PROCESS_FAILED}>
                <Card
                    label="Failed to Switch to wired mode"
                    primaryButtonLabel="Try again"
                    status="fail"
                    isActive
                    icon={BiRegularError}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_NAME)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_NAME)
                        })
                    }}>
                    <Typography color="red">
                        {!error()?.length
                            ? 'Something went wrong, please contact with us on discord'
                            : error()}
                    </Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default WiredProcessWizard
