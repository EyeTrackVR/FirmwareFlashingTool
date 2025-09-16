import Button from '@components/Buttons/Button'
import DefaultButton from '@components/Buttons/DefaultButton'
import Card from '@components/Card'
import NetworkInput from '@components/Inputs/NetworkInput'
import PasswordInput from '@components/Inputs/PasswordInput'
import Typography from '@components/Typography'
import { ACTION, FLASH_WIZARD_STEPS } from '@interfaces/enums'
import { shortMdnsAddress } from '@src/utils'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp, IoChevronBackSharp } from 'solid-icons/io'
import { RiSystemLockPasswordLine } from 'solid-icons/ri'
import { batch, For, Match, Switch } from 'solid-js'

const WirelessProcessWizard = () => {
    const { ssid, password, setNetwork, mdns } = useAppAPIContext()

    const exampleData = new Array(20).fill(0).map((el) => ({
        ssid: 'Example SSID',
        channel: 8,
        signal: -50,
        security: 'WPA2 PSK',
    }))

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
                <div class="bg-black-900 flex p-12 rounded-12 flex-col items-center justify-between h-[480px] w-[720px]">
                    <div class="flex flex-row w-full justify-between">
                        <DefaultButton
                            class="opacity-1 hover:bg-black-800 rounded-full flex items-center justify-center p-6 duration-300 transition-colors"
                            onClick={() => {}}>
                            <IoChevronBackSharp class="w-[18px] h-[18px] text-lightBlue-300" />
                        </DefaultButton>
                    </div>
                    <div class="w-full flex-1 flex flex-col items-center justify-center gap-24 overflow-hidden pb-12">
                        <div class="flex flex-col items-center gap-24">
                            <div class="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-black-800"></div>
                            <div class="flex flex-row gap-12">
                                <Typography color="white" text="h1">
                                    Select Network
                                </Typography>
                            </div>
                        </div>
                        <div class="flex-1 gap-4 flex flex-col w-full overflow-hidden">
                            <div class="grid grid-cols-4 gap-4 w-full px-6">
                                <Typography color="white" text="caption" class="text-left">
                                    SSID
                                </Typography>
                                <Typography color="white" text="caption">
                                    Channel
                                </Typography>
                                <Typography color="white" text="caption">
                                    Signal
                                </Typography>
                                <Typography color="white" text="caption" class="text-right">
                                    Security
                                </Typography>
                            </div>
                            <div class="w-full flex-1 overflow-y-auto gap-4 flex flex-col px-6 scrollbar">
                                <For each={exampleData}>
                                    {(el) => (
                                        <div class="grid grid-cols-4 px-12 py-12 gap-4 rounded-8 w-full mt-2 bg-black-800 duration-150 transition-colors hover:bg-purple-200 cursor-pointer">
                                            <Typography
                                                color="white"
                                                text="caption"
                                                class="text-left">
                                                {el.ssid}
                                            </Typography>
                                            <Typography color="white" text="caption">
                                                {el.channel}
                                            </Typography>
                                            <Typography color="white" text="caption">
                                                {`(${el.signal} dBm) `}
                                            </Typography>
                                            <Typography
                                                color="white"
                                                text="caption"
                                                class="text-right">
                                                {el.security}
                                            </Typography>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row gap-12 w-full items-center justify-end">
                        <div>
                            <Button label="Manual setup" onClick={() => {}} />
                        </div>
                    </div>
                </div>
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
