import Button from '@components/Buttons/Button'
import SelectButton from '@components/Buttons/SelectButton'
import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import { ACTION, DEVICE_MODE_WIZARD, INIT_WIZARD_STEPS, MODAL_TYPE } from '@interfaces/enums'
import { getApi } from '@src/esp'
import { DeviceMode } from '@src/esp/interfaces/types'
import { logger } from '@src/logger'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { useAppUIContext } from '@store/context/ui'
import { BiRegularChip, BiRegularError } from 'solid-icons/bi'
import { BsDisplayport } from 'solid-icons/bs'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { batch, Match, Switch } from 'solid-js'

const ChangeDeviceModeWizard = () => {
    const { setOpenModal } = useAppUIContext()
    const { activePort, deviceMode, setDeviceMode, setActivePortName } = useAppAPIContext()

    const onClickSetActiveDeviceMode = async (mode: DeviceMode) => {
        batch(() => {
            setAction(ACTION.NEXT)
            setStep(DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_PROCESS)
        })

        logger.functionStart('onClickSetActiveDeviceMode')
        logger.add('mode: ' + mode)

        try {
            await getApi().switchDeviceMode(activePort().activePortName, mode)

            batch(() => {
                setAction(ACTION.NEXT)
                setStep(DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_SUCCESS)
            })
        } catch (err) {
            logger.errorStart(' ERRROR ')
            logger.add(err instanceof Error ? err.message : `${err}`)
            logger.errorEnd(' ERRROR ')

            batch(() => {
                setAction(ACTION.NEXT)
                setStep(DEVICE_MODE_WIZARD.DEVICE_SWITCHING_DEVICE_MODE_FAILED)
            })
        }
        logger.functionEnd('onClickSetActiveDeviceMode')
    }

    const detectDeviceMode = async () => {
        logger.functionStart('detectDeviceMode')
        logger.add('active port: ' + activePort().activePortName)

        try {
            const api = getApi()
            await api.pause(activePort().activePortName)

            const deviceMode = await api.getDeviceMode(activePort().activePortName)
            batch(() => {
                setAction(ACTION.NEXT)
                setDeviceMode(deviceMode.toLocaleLowerCase() as DeviceMode)
                setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_DEVICE_MODE)
            })
        } catch (err) {
            console.log(err)
            logger.errorStart('detect device mode ERRROR ')
            logger.add(err instanceof Error ? err.message : `${err}`)
            logger.errorEnd('detect device mode ERRROR ')

            batch(() => {
                setAction(ACTION.NEXT)
                setStep(DEVICE_MODE_WIZARD.DETECT_DEVICE_MODE_FAILED)
            })
        }
        logger.functionEnd('detectDeviceMode')
    }

    return (
        <Switch>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DEVICE_BEFORE_PROCEEDING}>
                <Card
                    primaryButtonLabel="Select port"
                    isActive
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(INIT_WIZARD_STEPS.SELECT_PROCESS)
                        })
                    }}
                    onClickPrimary={async () => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setActivePortName('')
                            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_PORT)
                        })
                    }}
                    label="Before proceeding"
                    description="Unplug your board, then reconnect it to the PC without pressing any buttons to ensure it starts fresh."
                />
            </Match>
            <Match when={activeStep() === DEVICE_MODE_WIZARD.DEVICE_SELECT_PORT}>
                <Card
                    primaryButtonLabel="Detect device mode"
                    isActive={activePort().activePortName !== ''}
                    icon={BsDisplayport}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(DEVICE_MODE_WIZARD.DEVICE_BEFORE_PROCEEDING)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(DEVICE_MODE_WIZARD.DETECT_DEVICE_MODE)
                        })
                        detectDeviceMode().catch(() => {})
                    }}
                    label="Select Port"
                    description="Choose the port your device is connected to, then click the button below.">
                    <SelectButton
                        tabIndex={0}
                        type="button"
                        label={
                            activePort().activePortName === ''
                                ? 'Select Port'
                                : activePort().activePortName
                        }
                        onClick={() => {
                            setOpenModal({ open: true, type: MODAL_TYPE.SELECT_PORT })
                        }}
                    />
                </Card>
            </Match>
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
                            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_PORT)
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
                            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_PORT)
                        })
                    }}
                    secondaryButtonLabel="Back"
                    primaryButtonLabel="Try again"
                    description="Failed to detect device mode, Unplug your board, then reconnect it to the PC without pressing any buttons. Then click the button below."
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
                            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_PORT)
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
                            disabled={deviceMode() === 'auto'}
                            isActive={deviceMode() === 'auto'}
                            onClick={() => {
                                if (deviceMode() === 'auto') return
                                onClickSetActiveDeviceMode('auto').catch(() => {})
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
