import Card from '@components/Cards/Card'
import {
    ACTION,
    FLASH_WIZARD_STEPS,
    INIT_WIZARD_STEPS,
    TERMINAL_WIZARD_STEPS,
} from '@interfaces/enums'
import { useNavigate } from '@solidjs/router'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep, prevStep } from '@store/animation/selectors'
import { BiRegularChip } from 'solid-icons/bi'
import { batch, Match, Switch } from 'solid-js'

const TerminalProcessWizard = () => {
    const navigate = useNavigate()

    return (
        <Switch>
            <Match when={activeStep() === TERMINAL_WIZARD_STEPS.TERMINAL_BEFORE_PROCEEDING}>
                <Card
                    primaryButtonLabel="Continue"
                    isActive
                    icon={BiRegularChip}
                    onClickBack={() => {
                        if (prevStep() === FLASH_WIZARD_STEPS.FLASH_PROCESS_SUCCESS) {
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS_SUCCESS)
                            })
                        } else {
                            const savePrev = prevStep() !== FLASH_WIZARD_STEPS.FLASH_PROCESS_SUCCESS
                            batch(() => {
                                setAction(ACTION.PREV)
                                setStep(INIT_WIZARD_STEPS.PROCESS_INIT, savePrev)
                            })
                        }
                    }}
                    onClickPrimary={() => {
                        navigate('/terminal')
                    }}
                    label="Before proceeding."
                    description="Unplug your board, then reconnect it to the PC without pressing any buttons."
                />
            </Match>
        </Switch>
    )
}

export default TerminalProcessWizard
