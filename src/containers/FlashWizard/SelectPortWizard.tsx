import SelectButton from '@components/Buttons/SelectButton'
import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import {
    ACTION,
    FLASH_MODE,
    FLASH_WIZARD_STEPS,
    MODAL_TYPE,
    PORT_WIZARD_STEPS,
    WIRED_WIZARD_STEPS,
    WIRELESS_WIZARD_STEPS,
} from '@interfaces/enums'
import { getApi } from '@src/esp'
import { logger } from '@src/logger'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep, selectedMode } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { useAppUIContext } from '@store/context/ui'
import { setAvailableNetworks } from '@store/network/network'
import { BiRegularChip, BiRegularLoaderAlt } from 'solid-icons/bi'
import { BsDisplayport } from 'solid-icons/bs'
import { batch, Match, Switch } from 'solid-js'

const SelectPortWizard = () => {
    const { activePort, isActivePortValid, setActivePortName } = useAppAPIContext()
    const { setOpenModal } = useAppUIContext()

    const onClickVerifyPortConnection = async () => {
        batch(() => {
            logger.infoStart('Verify Port connection')
            logger.add('active port: ' + activePort().activePortName)
            logger.add('selected mode: ' + selectedMode())
            logger.add('is active port valid: ' + isActivePortValid())
            setAction(ACTION.NEXT)
            setStep(PORT_WIZARD_STEPS.PORT_CHECK_PORT_CONNECTION)
        })

        const api = getApi()

        try {
            await api.switchDeviceMode(
                activePort().activePortName,
                selectedMode() === FLASH_MODE.WIRED ? 'uvc' : 'wifi',
            )

            const isTheSamePort = await api.checkPortConnection(activePort().activePortName)

            if (isTheSamePort) {
                if (selectedMode() === FLASH_MODE.WIRED) {
                    batch(() => {
                        setAction(ACTION.NEXT)
                        setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_NAME)
                    })
                } else {
                    batch(() => {
                        setAction(ACTION.NEXT)
                        setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_WIRELESS_MODE)
                    })

                    try {
                        const networks = await api.getAvailableNetworks(activePort().activePortName)
                        setAvailableNetworks(networks)
                    } catch (err) {
                        setAvailableNetworks([])
                    }

                    batch(() => {
                        setAction(ACTION.NEXT)
                        setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
                    })
                }
            } else {
                batch(() => {
                    setAction(ACTION.NEXT)
                    setActivePortName('')
                    setStep(PORT_WIZARD_STEPS.PORT_SELECT_PORT)
                })
            }
        } catch (err) {
            batch(() => {
                logger.errorStart('Verify Port connection ERROR')
                logger.add(err instanceof Error ? err.message : `${err}`)
                logger.errorEnd('Verify Port connection ERROR')
                setAction(ACTION.NEXT)
                setActivePortName('')
                setStep(PORT_WIZARD_STEPS.PORT_SELECT_PORT)
            })
        }

        logger.infoEnd('Verify Port connection')
    }

    return (
        <Switch>
            <Match when={activeStep() === PORT_WIZARD_STEPS.PORT_BEFORE_PROCEEDING}>
                <Card
                    primaryButtonLabel="Verify connection"
                    isActive
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_MODE)
                        })
                    }}
                    onClickPrimary={async () => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(PORT_WIZARD_STEPS.PORT_CHECK_PORT_CONNECTION)
                        })
                        onClickVerifyPortConnection()
                    }}
                    label="Before proceeding"
                    description="Unplug your board, then reconnect it to the PC without pressing any buttons."
                />
            </Match>
            <Match when={activeStep() === PORT_WIZARD_STEPS.PORT_CHECK_PORT_CONNECTION}>
                <Card
                    isActive={isActivePortValid()}
                    isLoader
                    icon={BiRegularLoaderAlt}
                    label="Connecting">
                    <Typography text="caption" color="white" class="leading-[18px]">
                        Verifying port connection status.
                        <br /> <code class="text-purple-100">process can take up to (5s)</code>
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === PORT_WIZARD_STEPS.PORT_SELECT_PORT}>
                <Card
                    primaryButtonLabel="Connect"
                    isActive={activePort().activePortName !== ''}
                    icon={BsDisplayport}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(PORT_WIZARD_STEPS.PORT_BEFORE_PROCEEDING)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(PORT_WIZARD_STEPS.PORT_CHECK_PORT_CONNECTION)
                        })
                        onClickVerifyPortConnection()
                    }}
                    label="Select Port"
                    description="Choose the port your device is connected to, then click the button below to begin flashing and follow the on-screen instructions.">
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
        </Switch>
    )
}

export default SelectPortWizard
