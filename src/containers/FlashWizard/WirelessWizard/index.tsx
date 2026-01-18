import DefaultButton from '@components/Buttons/DefaultButton'
import SwitchButton from '@components/Buttons/Toggle'
import Card from '@components/Cards/Card'
import NetworkCard from '@components/Cards/NetworkCard'
import Input from '@components/Inputs/Input'
import NetworkInput from '@components/Inputs/NetworkInput'
import PasswordInput from '@components/Inputs/PasswordInput'
import Typography from '@components/Typography'
import {
    ACTION,
    INIT_WIZARD_STEPS,
    SELECT_MODE_WIZARD,
    SELECT_PORT_WIZARD,
    SETUP_MAC_ADDRESS,
    STEP_ACTION,
    WIRELESS_WIZARD_STEPS,
} from '@interfaces/animation/enums'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import { getApi } from '@src/esp'
import { logger } from '@src/logger'
import { formatMac, shortMdnsAddress } from '@src/utils'
import { addNotification } from '@store/actions/notifications/addNotification'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep, prevStep } from '@store/animation/selectors'
import { activePort } from '@store/esp/selectors'
import {
    setMac,
    setMdns,
    setPassword,
    setResetNetworkState,
    setSelectedNetwork,
    setSsid,
} from '@store/network/network'
import {
    availableNetworks,
    mac,
    mdns,
    password,
    selectedNetwork,
    ssid,
} from '@store/network/selectors'
import { activeStepAction } from '@store/ui/selectors'
import { writeText } from '@tauri-apps/api/clipboard'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { RiSystemLockPasswordLine } from 'solid-icons/ri'
import { batch, createMemo, createSignal, Match, onCleanup, Show, Switch } from 'solid-js'

const WirelessWizard = () => {
    const [setupMacAddress, setSetupMacAddress] = createSignal(false)
    const [ipAddress, setIpAddress] = createSignal<string | undefined>('')
    const sortedNetworks = createMemo(() => {
        return [...availableNetworks()].sort((a, b) => {
            return Math.abs(+a.rssi) - Math.abs(+b.rssi)
        })
    })

    onCleanup(() => {
        setIpAddress(undefined)
    })

    const copyToClipboard = async (value: string) => {
        try {
            await writeText(value)
            addNotification({
                title: 'Copied to clipboard',
                message: 'Copied to clipboard',
                type: NOTIFICATION_TYPE.INFO,
            })
        } catch (e) {
            addNotification({
                title: 'Failed to copy to clipboard',
                message: 'Failed to copy to clipboard',
                type: NOTIFICATION_TYPE.ERROR,
            })
        }
    }

    return (
        <Switch>
            <Match when={activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_WIRELESS_MODE}>
                <Card icon={BiRegularLoaderAlt} label="Wireless Mode" isLoader>
                    <Typography text="caption" color="white" class="leading-[18px]">
                        Switching to wireless mode. Please wait.
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_SCAN_FOR_NETWORKS}>
                <Card
                    description="Scanning for Wi-Fi… Looking for available networks."
                    label="Scanning for Wi-Fi"
                    icon={BiRegularLoaderAlt}
                    isLoader
                />
            </Match>
            <Match when={activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK}>
                <NetworkCard
                    data={sortedNetworks()}
                    onClickBack={() => {
                        if (
                            activeStepAction() === STEP_ACTION.SELECT_NETWORK ||
                            activeStepAction() === STEP_ACTION.UPDATE_NETWORK
                        ) {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                            })
                        } else {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(SELECT_MODE_WIZARD.SELECT_MODE)
                            })
                        }
                    }}
                    onClickNetwork={(network) => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setSelectedNetwork(network)
                            setSsid(network.ssid)
                            setMac(formatMac(network.mac_address))
                            setResetNetworkState()
                            setSetupMacAddress(false)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_CREDENTIALS)
                        })
                    }}
                    onClickManualSetup={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP)
                            setSelectedNetwork(undefined)
                            setSetupMacAddress(false)
                            setResetNetworkState()
                            setSsid('')
                            setMac('')
                        })
                    }}
                />
            </Match>
            <Match when={activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP}>
                <Card
                    label="Setup Wi-Fi"
                    primaryButtonLabel="Continue"
                    isActive={password().length > 0 && ssid().length > 0}
                    icon={RiSystemLockPasswordLine}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
                        })
                    }}
                    onClickPrimary={() => {
                        if (setupMacAddress()) {
                            batch(() => {
                                setAction(ACTION.NEXT)
                                setStep(SETUP_MAC_ADDRESS.SETUP_MAC_ADDRESS, true)
                            })
                        } else {
                            batch(() => {
                                setAction(ACTION.NEXT)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS)
                            })
                        }
                    }}>
                    <div class="w-full flex flex-col gap-12">
                        <div class="flex flex-col gap-12">
                            <div class="flex flex-col gap-4 w-full">
                                <Typography color="white" text="caption" class="text-left">
                                    SSID
                                </Typography>
                                <Input
                                    required={true}
                                    onChange={(ssid) => {
                                        setSsid(ssid)
                                    }}
                                    value={ssid()}
                                    placeholder="Enter your wifi name"
                                />
                            </div>
                            <div class="flex flex-col gap-4 w-full">
                                <Typography color="white" text="caption" class="text-left">
                                    Password
                                </Typography>
                                <PasswordInput
                                    required={true}
                                    onChange={(password) => {
                                        setPassword(password)
                                    }}
                                    value={password()}
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>
                        <div class="flex flex-row justify-between">
                            <Typography color="white" text="caption" class="text-left">
                                Setup mac address
                            </Typography>
                            <SwitchButton
                                active={setupMacAddress()}
                                onClick={() => {
                                    setSetupMacAddress((prev) => !prev)
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_CREDENTIALS}>
                <Card
                    label="Setup credentials"
                    primaryButtonLabel="Continue"
                    isActive={password().length > 0}
                    icon={RiSystemLockPasswordLine}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
                        })
                    }}
                    onClickPrimary={() => {
                        if (setupMacAddress()) {
                            batch(() => {
                                setAction(ACTION.NEXT)
                                setStep(SETUP_MAC_ADDRESS.SETUP_MAC_ADDRESS)
                            })
                        } else {
                            batch(() => {
                                setAction(ACTION.NEXT)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS)
                            })
                        }
                    }}
                    description="Here you set your Wi-Fi password so the device can connect to your wireless network.">
                    <div class="flex flex-col gap-12 w-full">
                        <div class="flex flex-col gap-10 w-full">
                            <Typography color="white" text="caption" class="text-left">
                                Password
                            </Typography>
                            <PasswordInput
                                required={true}
                                onChange={(password) => {
                                    setPassword(password)
                                }}
                                value={password()}
                                placeholder="Enter password"
                            />
                        </div>
                        <div class="flex flex-row justify-between">
                            <Typography color="white" text="caption" class="text-left">
                                Setup mac address
                            </Typography>
                            <SwitchButton
                                active={setupMacAddress()}
                                onClick={() => {
                                    setSetupMacAddress((prev) => !prev)
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS}>
                <Card
                    label="Setup mdns"
                    primaryButtonLabel="Continue"
                    isActive={mdns().length > 0}
                    icon={RiSystemLockPasswordLine}
                    onClickBack={() => {
                        const manual = [
                            WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP,
                            WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_CREDENTIALS,
                        ].some((step) => step === prevStep())

                        if (manual && setupMacAddress()) {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(SETUP_MAC_ADDRESS.SETUP_MAC_ADDRESS, false)
                            })
                            return
                        }

                        const savePrev = prevStep() !== WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP
                        if (prevStep() === WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP) {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP)
                            })
                        } else {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_CREDENTIALS, savePrev)
                            })
                        }
                    }}
                    onClickPrimary={() => {
                        const savePrev = prevStep() !== WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP
                        batch(() => {
                            setIpAddress(undefined)
                            setAction(ACTION.NEXT)
                            setStep(
                                WIRELESS_WIZARD_STEPS.WIRELESS_WIFI_CONNECTING_PROCESS,
                                savePrev,
                            )
                            logger.infoStart('Setup wireless connection')
                            logger.add('active port: ' + activePort())
                            logger.add('mdns: ' + mdns())
                        })

                        getApi()
                            .setupWirelessConnection(
                                activePort(),
                                mdns(),
                                ssid(),
                                password(),
                                selectedNetwork()?.channel ?? 0,
                                mac(),
                            )
                            .then((ipAddress) => {
                                batch(() => {
                                    setIpAddress(ipAddress)
                                    setAction(ACTION.NEXT)
                                    setStep(
                                        WIRELESS_WIZARD_STEPS.WIRELESS_WIFI_CONNECTING_PROCESS_SUCCESS,
                                        savePrev,
                                    )
                                })
                            })
                            .catch((err) => {
                                batch(() => {
                                    logger.errorStart('Verify Port connection ERROR')
                                    logger.add(err instanceof Error ? err.message : `${err}`)
                                    logger.errorEnd('Verify Port connection ERROR')
                                    setAction(ACTION.NEXT)
                                    setStep(
                                        WIRELESS_WIZARD_STEPS.WIRELESS_WIFI_CONNECTING_PROCESS_FAILED,
                                        savePrev,
                                    )
                                })
                            })
                            .finally(() => {
                                logger.infoEnd('Setup wireless connection')
                            })
                    }}>
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
                            Setup tracker name
                        </Typography>
                        <NetworkInput
                            id="mdns"
                            type="text"
                            onChange={(mdns) => {
                                setMdns(mdns)
                            }}
                            value={mdns()}
                            placeholder={
                                !mdns().length ? 'openiristracker' : shortMdnsAddress(mdns())
                            }
                        />
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_WIFI_CONNECTING_PROCESS}>
                <Card
                    label="Connecting..."
                    primaryButtonLabel="Continue"
                    isLoader
                    icon={BiRegularLoaderAlt}
                    onClickPrimary={() => {}}
                    description="Attempting to connect to the specified network"
                />
            </Match>
            <Match
                when={
                    activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_WIFI_CONNECTING_PROCESS_SUCCESS
                }>
                <Card
                    status="success"
                    secondaryButtonLabel="Return to the beginning"
                    isActive
                    icon={IoCheckmarkSharp}
                    onClickBack={() => {
                        const savePrev = prevStep() !== WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS, savePrev)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(INIT_WIZARD_STEPS.PROCESS_INIT)
                        })
                    }}
                    label="Its done!"
                    description="Your device is set up and ready to go.">
                    <Show when={ipAddress()}>
                        <div class="flex flex-col gap-24 pb-32">
                            <div class="flex flex-col items-center gap-6">
                                <Typography color="purple" text="body">
                                    Your device IP is:
                                </Typography>
                                <DefaultButton
                                    onClick={() => {
                                        copyToClipboard(ipAddress() ?? '----')
                                    }}>
                                    <Typography color="white" text="body" select>
                                        {ipAddress()}
                                    </Typography>
                                </DefaultButton>
                            </div>
                            <div class="flex flex-col items-center gap-6">
                                <div>
                                    <Typography color="purple" text="body">
                                        The stream is also accessible under:
                                    </Typography>
                                    <Typography color="purple" text="small">
                                        (the IP may change)
                                    </Typography>
                                </div>
                                <DefaultButton
                                    onClick={() => {
                                        copyToClipboard(`http://${mdns()}.local`)
                                    }}>
                                    <Typography color="white" text="body" select>
                                        {`http://${shortMdnsAddress(mdns())}.local`}
                                    </Typography>
                                </DefaultButton>
                            </div>
                        </div>
                    </Show>
                </Card>
            </Match>
            <Match
                when={
                    activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_WIFI_CONNECTING_PROCESS_FAILED
                }>
                <Card
                    status="fail"
                    primaryButtonLabel="Try again"
                    secondaryButtonLabel="Select Network"
                    isActive
                    icon={BiRegularError}
                    onClickBack={() => {
                        if (prevStep() === WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP) {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP, false)
                            })
                        } else {
                            const savePrev =
                                prevStep() !== WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_CREDENTIALS, savePrev)
                            })
                        }
                    }}
                    onClickSecondary={() => {
                        if (prevStep() === WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP) {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP, false)
                            })
                        } else {
                            batch(() => {
                                setAction(ACTION.NEXT)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
                            })
                        }
                    }}
                    onClickPrimary={() => {
                        if (prevStep() === WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP) {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP, false)
                            })
                        } else {
                            const savePrev =
                                prevStep() !== WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP

                            batch(() => {
                                setAction(ACTION.NEXT)
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_CREDENTIALS, savePrev)
                            })
                        }
                    }}
                    label="Connection failed">
                    <Typography color="red">Failed to connect to the specified network </Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default WirelessWizard
