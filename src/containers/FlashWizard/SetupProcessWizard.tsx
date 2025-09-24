import SelectButton from '@components/Buttons/SelectButton'
import Card from '@components/Cards/Card'
import {
    ACTION,
    FLASH_WIZARD_STEPS,
    INIT_WIZARD_STEPS,
    MODAL_TYPE,
    TERMINAL_WIZARD_STEPS,
} from '@interfaces/enums'
import { logger } from '@src/logger'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
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
    const { setOpenModal, hideModal } = useAppUIContext()
    const { activeBoard, activePort, downloadAsset, getFirmwareType, setActivePortName } =
        useAppAPIContext()

    return (
        <Switch>
            <Match when={activeStep() === INIT_WIZARD_STEPS.PROCESS_INIT}>
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
                            setStep(INIT_WIZARD_STEPS.SELECT_BOARD)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(TERMINAL_WIZARD_STEPS.TERMINAL_BEFORE_PROCEEDING)
                        })
                    }}
                    label="Flash Your Board"
                    description="Click the button below to start the flashing process and follow the on-screen prompts to complete the setup."
                />
            </Match>
            <Match when={activeStep() === INIT_WIZARD_STEPS.SELECT_BOARD}>
                <Card
                    isActive={activeBoard() !== ''}
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(INIT_WIZARD_STEPS.PROCESS_INIT)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setActivePortName('')
                            setStep(INIT_WIZARD_STEPS.SELECT_PORT)
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
            <Match when={activeStep() === INIT_WIZARD_STEPS.SELECT_PORT}>
                <Card
                    primaryButtonLabel="Flash Board"
                    isActive={activePort().activePortName !== ''}
                    icon={BsDisplayport}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(INIT_WIZARD_STEPS.SELECT_BOARD)
                        })
                    }}
                    onClickPrimary={() => {
                        if (!hideModal()) {
                            setOpenModal({
                                open: true,
                                type: MODAL_TYPE.BEFORE_FLASHING,
                            })
                            return
                        }

                        batch(() => {
                            logger.infoStart('INIT_WIZARD_STEPS.SELECT_PORT')
                            logger.add(`firmware type : ${getFirmwareType()}`)
                            logger.add(`active port : ${activePort().activePortName}`)
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
        </Switch>
    )
}

export default SetupProcessWizard
