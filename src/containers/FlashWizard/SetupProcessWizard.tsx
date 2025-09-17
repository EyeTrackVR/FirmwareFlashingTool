import SelectButton from '@components/Buttons/SelectButton'
import Card from '@components/Cards/Card'
import { ACTION, FLASH_WIZARD_STEPS, MODAL_TYPE } from '@interfaces/enums'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep, prevStep } from '@store/animation/selectors'
import { useAppAPIContext } from '@store/context/api'
import { useAppUIContext } from '@store/context/ui'
import { installOpenIris } from '@store/terminal/actions'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'
import { BiRegularChip } from 'solid-icons/bi'
import { BsDisplayport } from 'solid-icons/bs'
import { batch, Match, Switch } from 'solid-js'

const SetupProcessWizard = () => {
    const { activeBoard, activePort, downloadAsset, getFirmwareType } = useAppAPIContext()
    const { setOpenModal, hideModal } = useAppUIContext()

    return (
        <Switch>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.INIT}>
                <Card
                    primaryButtonLabel="Install Openiris"
                    secondaryButtonLabel="Show Logs"
                    isActive
                    icon={BiRegularChip}
                    onClickSettings={() => {
                        setOpenModal({ open: true, type: MODAL_TYPE.DEVTOOLS })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.SELECT_BOARD)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.BEFORE_PROCEEDING)
                        })
                    }}
                    label="Flash Your Board"
                    description="Click the button below to start the flashing process and follow the on-screen prompts to complete the setup."
                />
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SELECT_BOARD}>
                <Card
                    isActive={activeBoard() !== ''}
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.INIT)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    primaryButtonLabel="Next"
                    label="Select Board"
                    description="Choose your board from the list, then click the button below to start flashing and follow the on-screen instructions.">
                    <SelectButton
                        tabIndex={0}
                        type="button"
                        label={activeBoard() === '' ? 'Select board' : activeBoard()}
                        onClick={() => {
                            setOpenModal({ open: true, type: MODAL_TYPE.SELECT_BOARD })
                        }}
                    />
                </Card>
            </Match>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SELECT_PORT}>
                <Card
                    primaryButtonLabel="Flash Board"
                    isActive={activePort().activePortName !== ''}
                    icon={BsDisplayport}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.SELECT_BOARD)
                        })
                    }}
                    onClickPrimary={() => {
                        if (prevStep() === FLASH_WIZARD_STEPS.CHECK_PORT_CONNECTION) {
                            batch(() => {
                                setAction(ACTION.NEXT)
                                setStep(FLASH_WIZARD_STEPS.SELECT_MODE)
                            })
                            return
                        }
                        if (!hideModal()) {
                            setOpenModal({
                                open: true,
                                type: MODAL_TYPE.BEFORE_FLASHING,
                            })
                            return
                        }
                        if (!hideModal()) {
                            setOpenModal({
                                open: true,
                                type: MODAL_TYPE.BEFORE_FLASHING,
                            })
                            return true
                        }
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS)
                            setAbortController('openiris')
                            setProcessStatus(true)
                            restartFirmwareState()
                        })

                        installOpenIris(activePort().activePortName, async () => {
                            await downloadAsset(getFirmwareType())
                        }).catch(() => {})
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
            <Match when={activeStep() === FLASH_WIZARD_STEPS.BEFORE_PROCEEDING}>
                <Card
                    secondaryButtonLabel="Show logs"
                    isActive
                    icon={BsDisplayport}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.INIT)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.SHOW_TERMINAL)
                        })
                    }}
                    label="Before proceeding"
                    description="Unplug your board, then reconnect it to the PC without pressing any buttons and press Show logs."
                />
            </Match>
        </Switch>
    )
}

export default SetupProcessWizard
