import Card from '@components/Card'
import Input from '@components/Inputs/Input'
import Typography from '@components/Typography'
import { ACTION, FLASH_WIZARD_STEPS } from '@interfaces/enums'
import { shortMdnsAddress } from '@src/utils'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { VsDeviceCameraVideo } from 'solid-icons/vs'
import { batch, Match, Switch } from 'solid-js'

const WiredProcessWizard = () => {
    const { trackerName, setTrackerName } = useAppAPIContext()

    // Sending: {"commands": [{"command": "get_mdns_name"}]} zwraca nazwę aktualną nazwę
    // {"commands": [{"command": "set_mdns", "data": {"hostname": "thisIsTheWay"}}]} // ustawia nazwę

    return (
        <Switch>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SETUP_TRACKER_NAME}>
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
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.FLASH_WIRED_PROCESS)
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
            <Match when={activeStep() === FLASH_WIZARD_STEPS.FLASH_WIRED_PROCESS}>
                <Card
                    label="Setup tracker name"
                    primaryButtonLabel="Continue"
                    isLoader // we have to check if process is active
                    icon={BiRegularLoaderAlt}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SETUP_TRACKER_NAME)
                        })
                    }}
                    onClickPrimary={() => {}}
                    description="Switching to wired mode… The device will now appear as a UVC camera. with an additional COM port for communication"
                />
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.FLASH_WIRED_PROCESS_SUCCESS}>
                <Card
                    status="success"
                    secondaryButtonLabel="Return to the beginning"
                    isActive
                    icon={IoCheckmarkSharp}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SETUP_TRACKER_NAME)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.INIT)
                        })
                    }}
                    label="Its done!"
                    description="Your device is set up and ready to go."
                />
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.FLASH_WIRED_PROCESS_FAILED}>
                <Card
                    label="Failed to Switch to wired mode"
                    primaryButtonLabel="Try again"
                    status="fail"
                    isActive
                    icon={BiRegularError}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SETUP_TRACKER_NAME)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.SETUP_TRACKER_NAME)
                        })
                    }}>
                    <Typography color="red">
                        Something went wrong, please contact with us on discord
                    </Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default WiredProcessWizard
