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
    STEP_ACTION,
    WIRELESS_WIZARD_STEPS,
} from '@interfaces/enums'
import { getApi } from '@src/esp'
import { logger } from '@src/logger'
import { shortMdnsAddress } from '@src/utils'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep, prevStep } from '@store/animation/selectors'
import { activePort } from '@store/esp/selectors'
import { setMdns, setPassword, setSelectedNetwork, setSsid } from '@store/network/network'
import { availableNetworks, mdns, password, selectedNetwork, ssid } from '@store/network/selectors'
import { activeStepAction } from '@store/ui/selectors'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { RiSystemLockPasswordLine } from 'solid-icons/ri'
import { batch, createMemo, Match, Switch } from 'solid-js'

const WirelessWizard = () => {
    const sortedNetworks = createMemo(() => {
        return [...availableNetworks()].sort((a, b) => {
            return Math.abs(+a.rssi) - Math.abs(+b.rssi)
        })
    })

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
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_CREDENTIALS)
                        })
                    }}
                    onClickManualSetup={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP)
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
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS)
                        })
                    }}>
                    <div class="w-full flex flex-col gap-24">
                        <div class="flex flex-col gap-10 w-full">
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
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS)
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
                                setPassword(password)
                            }}
                            value={password()}
                            placeholder="Enter password"
                        />
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
                            )
                            .then(() => {
                                batch(() => {
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
                            Password
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
                    description="Your device is set up and ready to go."
                />
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
                        const savePrev = prevStep() !== WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS, savePrev)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
                        })
                    }}
                    onClickPrimary={() => {
                        const savePrev = prevStep() !== WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS, savePrev)
                        })
                    }}
                    label="Connection failed">
                    <Typography color="red">Failed to connect to the specified network </Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default WirelessWizard
