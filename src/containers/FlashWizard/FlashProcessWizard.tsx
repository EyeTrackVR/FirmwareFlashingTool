import Card from '@components/Card'
import Typography from '@components/Typography'
import { ACTION, FLASH_WIZARD_STEPS } from '@interfaces/enums'
import { IFirmwareState } from '@interfaces/interfaces'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { validateUserPortConnection } from '@store/terminal/actions'
import { firmwareState, isActiveProcess, percentageProgress } from '@store/terminal/selectors'
import { BiRegularChip, BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { Accessor, batch, createMemo, Match, Switch } from 'solid-js'

const FlashProcessWizard = () => {
    const { activePort, isActivePortValid } = useAppAPIContext()
    const flashFirmwareState: Accessor<IFirmwareState | undefined> = createMemo(() => {
        const state = Object.keys(firmwareState()).map((key) => {
            return { step: key, ...firmwareState()[key] }
        })
        return state[state.length - 1]
    })

    return (
        <Switch>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.FLASH_PROCESS}>
                <Card
                    primaryButtonLabel="Continue"
                    isActive={percentageProgress() >= 100 && !isActiveProcess()}
                    isLoader
                    icon={BiRegularLoaderAlt}
                    onClickBack={() => {
                        if (isActiveProcess()) return
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    onClickPrimary={() => {}}
                    label="Flashing Board"
                    percentageProgress={percentageProgress()}>
                    <Typography color="white">
                        {flashFirmwareState()?.label ?? 'Processing....'}
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.FLASH_PROCESS_SUCCESS}>
                <Card
                    status="success"
                    primaryButtonLabel="Continue setup"
                    secondaryButtonLabel="Show Logs"
                    isActive
                    icon={IoCheckmarkSharp}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.BEFORE_CONTINUE_CONFIG)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.BEFORE_CONTINUE_CONFIG)
                        })
                    }}
                    label="Firmware flashed!">
                    <div>
                        <Typography text="caption" color="white">
                            Firmware successfully flashed.
                            <br /> If it's the first time flashing this board.
                            <br /> press <code class="text-purple-100">continue setup</code>{' '}
                            Otherwise, press
                            <code class="text-purple-100"> Show logs.</code>
                        </Typography>
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.FLASH_PROCESS_FAILED}>
                <Card
                    status="fail"
                    primaryButtonLabel="Try again"
                    secondaryButtonLabel="Select Port"
                    isActive
                    icon={BiRegularError}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    label="Failed to flash board">
                    <Typography color="red">
                        {flashFirmwareState()?.label ??
                            'Something went wrong, please contact with us on discord'}
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.BEFORE_CONTINUE_CONFIG}>
                <Card
                    primaryButtonLabel="Verify connection"
                    isActive
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.CHECK_PORT_CONNECTION)
                        })
                        validateUserPortConnection(activePort().activePortName)
                            .then((status) => {
                                if (status) {
                                    batch(() => {
                                        setAction(ACTION.NEXT)
                                        setStep(FLASH_WIZARD_STEPS.SELECT_MODE)
                                    })
                                    return
                                }
                                batch(() => {
                                    setAction(ACTION.NEXT)
                                    setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                                })
                            })
                            .catch(() => {
                                batch(() => {
                                    setAction(ACTION.NEXT)
                                    setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                                })
                            })
                    }}
                    label="Before proceeding"
                    description="Unplug your board, then reconnect it to the PC without pressing any buttons and press Show logs."
                />
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.CHECK_PORT_CONNECTION}>
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
        </Switch>
    )
}

export default FlashProcessWizard
