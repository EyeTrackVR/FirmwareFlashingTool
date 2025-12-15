import Button from '@components/Buttons/Button'
import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import {
    ACTION,
    DEVICE_MODE_WIZARD,
    INIT_WIZARD_STEPS,
    SELECT_PORT_WIZARD,
    STEP_ACTION,
    WIRELESS_WIZARD_STEPS,
} from '@interfaces/animation/enums'
import { getApi } from '@src/esp'
import { DeviceMode } from '@src/esp/interfaces/types'
import { logger } from '@src/logger'
import { detectDeviceMode } from '@store/actions/animation/detectDeviceMode'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { setActivePort } from '@store/esp/esp'
import { activePort, deviceMode } from '@store/esp/selectors'
import { setAvailableNetworks } from '@store/network/network'
import { setActiveAction } from '@store/ui/ui'
import { BiRegularChip, BiRegularError } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { batch, Match, Switch } from 'solid-js'

const ChangeDeviceModeWizard = () => {
    const onClickSetActiveDeviceMode = async (mode: DeviceMode) => {
        setActiveAction(STEP_ACTION.CHANGE_DEVICE_MODE)

        batch(() => {
            setAction(ACTION.NEXT)
            setStep(DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_PROCESS)
            logger.functionStart('onClickSetActiveDeviceMode')
            logger.add('mode: ' + mode)
        })

        const api = getApi()

        try {
            const deviceMode = await api.getDeviceMode(activePort())

            if (deviceMode.toLocaleLowerCase() !== mode.toLocaleLowerCase()) {
                await api.switchDeviceMode(activePort(), mode)
            }
        } catch (err) {
            batch(() => {
                setAction(ACTION.NEXT)
                setStep(DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_FAILED)
                logger.errorStart(' ERRROR ')
                logger.add(err instanceof Error ? err.message : `${err}`)
                logger.errorEnd(' ERRROR ')
            })
            return
        }

        if (mode === 'uvc') {
            batch(() => {
                setAction(ACTION.NEXT)
                setStep(DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_SUCCESS)
            })
        } else {
            setActiveAction(STEP_ACTION.SELECT_NETWORK)
            try {
                const isTheSamePort = await api.checkPortConnection(activePort())

                if (isTheSamePort) {
                    batch(() => {
                        setAction(ACTION.NEXT)
                        setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SCAN_FOR_NETWORKS)
                    })
                    try {
                        const networks = await getApi().getAvailableNetworks(activePort())
                        setAvailableNetworks(networks)
                    } catch (err) {
                        logger.errorStart(' ChangeDeviceModeWizard, line 75 ERROR  ')
                        logger.add(err instanceof Error ? err.message : `${err}`)
                        logger.errorEnd(' ChangeDeviceModeWizard, line 75 ERROR  ')
                        setAvailableNetworks([])
                    }
                    batch(() => {
                        setAction(ACTION.NEXT)
                        setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
                    })
                } else {
                    batch(() => {
                        setAction(ACTION.NEXT)
                        setActivePort('')
                        setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                    })
                }
            } catch {
                batch(() => {
                    setAction(ACTION.NEXT)
                    setActivePort('')
                    setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                })
            }
        }

        logger.functionEnd('onClickSetActiveDeviceMode')
    }

    return (
        <Switch>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DETECT_DEVICE_MODE}>
                <Card
                    isLoader
                    icon={BiRegularChip}
                    label="Detecting device mode"
                    description="Please wait while we detect your device mode."
                />
            </Match>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DETECT_DEVICE_MODE_FAILED}>
                <Card
                    status="fail"
                    icon={BiRegularError}
                    label="Failed to detect device mode"
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                        })
                    }}
                    isActive
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(DEVICE_MODE_WIZARD.DETECT_DEVICE_MODE)
                        })
                        detectDeviceMode()
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                        })
                    }}
                    secondaryButtonLabel="Back"
                    primaryButtonLabel="Try again"
                    description="Failed to detect device mode, Unplug your board, then reconnect it to the PC without pressing any buttons to ensure it starts fresh. Then click the button below."
                />
            </Match>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DEVICE_SELECT_DEVICE_MODE}>
                <Card
                    secondaryButtonLabel="Wi-Fi mode"
                    onClickOptionLabel="Wired Mode"
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                        })
                    }}
                    label="Select device mode">
                    <div class="w-full flex flex-col gap-6 ">
                        <div class="flex flex-col gap-6 text-left mx-auto">
                            <Typography text="caption" color="white">
                                <strong>UVC mode (wired):</strong> Connected via USB for stable
                                performance and no latency.
                            </Typography>
                            <Typography text="caption" color="white">
                                <strong>Auto mode:</strong> The device automatically chooses the
                                best option (wired or wireless).
                            </Typography>
                            <Typography text="caption" color="white">
                                <strong>Wireless mode:</strong> Cable-free connection for more
                                freedom, may introduce slight latency.
                            </Typography>
                        </div>
                    </div>
                    <div class="w-full flex flex-col gap-12">
                        <Button
                            label="Auto mode"
                            disabled={deviceMode() === 'setup'}
                            isActive={deviceMode() === 'setup'}
                            onClick={() => {
                                if (deviceMode() === 'setup') return
                                onClickSetActiveDeviceMode('setup').catch(() => {})
                            }}
                        />
                        <Button
                            label="UVC mode"
                            onClick={() => {
                                if (deviceMode() === 'uvc') return
                                onClickSetActiveDeviceMode('uvc').catch(() => {})
                            }}
                            disabled={deviceMode() === 'uvc'}
                            isActive={deviceMode() === 'uvc'}
                        />
                        <Button
                            label="Wi-Fi mode"
                            onClick={() => {
                                if (deviceMode() === 'wifi') return
                                onClickSetActiveDeviceMode('wifi').catch(() => {})
                            }}
                            disabled={deviceMode() === 'wifi'}
                            isActive={deviceMode() === 'wifi'}
                        />
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_PROCESS}>
                <Card
                    isLoader
                    icon={BiRegularChip}
                    label="Switching device mode"
                    description="Please wait while we switch your device mode."
                />
            </Match>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_FAILED}>
                <Card
                    status="fail"
                    icon={BiRegularError}
                    label="Failed to switch device mode"
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_DEVICE_MODE)
                        })
                    }}
                    isActive
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_DEVICE_MODE)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_DEVICE_MODE)
                        })
                    }}
                    secondaryButtonLabel="Back"
                    primaryButtonLabel="Try again"
                    description="Failed to switch device mode, try again."
                />
            </Match>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_SUCCESS}>
                <Card
                    status="success"
                    secondaryButtonLabel="Return to the beginning"
                    isActive
                    icon={IoCheckmarkSharp}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(INIT_WIZARD_STEPS.PROCESS_INIT)
                        })
                    }}
                    label="Its done!"
                    description="Successfully switched device mode."
                />
            </Match>
        </Switch>
    )
}

export default ChangeDeviceModeWizard
