import Card from '@components/Cards/Card'
import NetworkCard from '@components/Cards/NetworkCard'
import NetworkInput from '@components/Inputs/NetworkInput'
import PasswordInput from '@components/Inputs/PasswordInput'
import Typography from '@components/Typography'
import { ACTION, FLASH_WIZARD_STEPS } from '@interfaces/enums'
import { shortMdnsAddress } from '@src/utils'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { RiSystemLockPasswordLine } from 'solid-icons/ri'
import { batch, Match, Switch } from 'solid-js'

const WirelessProcessWizard = () => {
    const { ssid, password, setNetwork, mdns, availableNetworks } = useAppAPIContext()

    return (
        <Switch>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SCAN_NETWORK}>
                <Card
                    label="Scanning for Wi-Fi"
                    primaryButtonLabel="Continue"
                    isLoader
                    icon={BiRegularLoaderAlt}
                    onClickBack={() => {}}
                    onClickPrimary={() => {}}
                    description="Scanning for Wi-Fi… Looking for available networks."
                />
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SELECT_NETWORK}>
                <NetworkCard
                    data={availableNetworks()}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_MODE)
                        })
                    }}
                    onClickManualSetup={() => {}}
                />
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SETUP_CREDENTIALS}>
                <Card
                    label="Setup credentials"
                    primaryButtonLabel="Continue"
                    isActive={password().length > 0}
                    icon={RiSystemLockPasswordLine}
                    onClickBack={() => {}}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.SETUP_MDNS)
                        })
                    }}
                    description="Here you set your Wi-Fi password so the device can connect to your wireless network.">
                    <div class="flex flex-col gap-10 w-full">
                        <Typography color="white" text="caption" class="text-left">
                            Password
                        </Typography>
                        <PasswordInput
                            required={true}
                            onChange={(password) => {
                                setNetwork(ssid(), password, mdns())
                            }}
                            value={password()}
                            placeholder="Enter password"
                        />
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SETUP_MDNS}>
                <Card
                    label="Setup mdns"
                    primaryButtonLabel="Continue"
                    isActive={mdns().length > 0}
                    icon={RiSystemLockPasswordLine}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SETUP_CREDENTIALS)
                        })
                    }}
                    onClickPrimary={() => {}}>
                    <div class="flex flex-col gap-6">
                        <Typography color="white" text="caption">
                            The tracker will be accessible under
                        </Typography>
                        <Typography color="blue" text="caption">
                            http://{!mdns().length ? 'openiristracker' : shortMdnsAddress(mdns())}
                            .local
                        </Typography>
                    </div>
                    <div class="flex flex-col gap-10 w-full">
                        <Typography color="white" text="caption" class="text-left">
                            Password
                        </Typography>
                        <NetworkInput
                            id="mdns"
                            type="text"
                            onChange={(mdns) => {
                                setNetwork(ssid(), password(), mdns)
                            }}
                            value={mdns()}
                            placeholder={
                                !mdns().length ? 'openiristracker' : shortMdnsAddress(mdns())
                            }
                        />
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.WIFI_CONNECTING}>
                <Card
                    label="Connecting..."
                    primaryButtonLabel="Continue"
                    isLoader
                    icon={BiRegularLoaderAlt}
                    onClickBack={() => {}}
                    onClickPrimary={() => {}}
                    description="Attempting to connect to the specified network"
                />
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.WIFI_CONNECTING_SUCCESS}>
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
            <Match when={activeStep() === FLASH_WIZARD_STEPS.WIFI_CONNECTING_FAILED}>
                <Card
                    status="fail"
                    primaryButtonLabel="Try again"
                    secondaryButtonLabel="Select Network"
                    isActive
                    icon={BiRegularError}
                    onClickBack={() => {}}
                    onClickSecondary={() => {}}
                    onClickPrimary={() => {}}
                    label="Failed to connect to the specified network">
                    <Typography color="red">Lorem ipsum ...</Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default WirelessProcessWizard
