import Button from '@components/Buttons/Button'
import SelectButton from '@components/Buttons/SelectButton'
import Card from '@components/Cards/Card'
import {
    ACTION,
    INIT_WIZARD_STEPS,
    MODAL_TYPE,
    SELECT_PORT_WIZARD,
    STEP_ACTION,
    TERMINAL_WIZARD_STEPS,
} from '@interfaces/enums'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { activeBoard } from '@store/firmware/selectors'
import { setActiveAction, setOpenModal } from '@store/ui/ui'
import { BiRegularChip } from 'solid-icons/bi'
import { batch, Match, Switch } from 'solid-js'

const SetupWizard = () => {
    return (
        <Switch>
            <Match when={activeStep() === INIT_WIZARD_STEPS.PROCESS_INIT}>
                <Card
                    primaryButtonLabel="Setup process"
                    secondaryButtonLabel="Show Logs"
                    isActive
                    icon={BiRegularChip}
                    onClickSettings={() => {
                        setOpenModal({ open: true, type: MODAL_TYPE.DEVTOOLS })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(INIT_WIZARD_STEPS.SELECT_PROCESS)
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
            <Match when={activeStep() === INIT_WIZARD_STEPS.SELECT_PROCESS}>
                <Card
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(INIT_WIZARD_STEPS.PROCESS_INIT)
                        })
                    }}
                    isActive
                    primaryButtonLabel="Install openiris"
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(INIT_WIZARD_STEPS.SELECT_BOARD)
                        })
                    }}
                    label="Select process">
                    <div class="w-full flex-col flex gap-12 h-full ">
                        <Button
                            label="Change device mode"
                            onClick={() => {
                                batch(() => {
                                    setAction(ACTION.NEXT)
                                    setActiveAction(STEP_ACTION.CHANGE_DEVICE_MODE)
                                    setStep(SELECT_PORT_WIZARD.SELECT_PORT_BEFORE_PROCEEDING)
                                })
                            }}
                        />
                        <Button
                            label="Update network"
                            onClick={() => {
                                batch(() => {
                                    setAction(ACTION.NEXT)
                                    setActiveAction(STEP_ACTION.UPDATE_NETWORK)
                                    setStep(SELECT_PORT_WIZARD.SELECT_PORT_BEFORE_PROCEEDING)
                                })
                            }}
                        />
                    </div>
                </Card>
            </Match>
            <Match when={activeStep() === INIT_WIZARD_STEPS.SELECT_BOARD}>
                <Card
                    isActive={activeBoard() !== ''}
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(INIT_WIZARD_STEPS.SELECT_PROCESS)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setActiveAction(STEP_ACTION.INSTALL_OPENIRIS)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT_BEFORE_PROCEEDING)
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
        </Switch>
    )
}

export default SetupWizard
