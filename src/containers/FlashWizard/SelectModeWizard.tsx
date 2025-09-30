import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import {
    ACTION,
    FLASH_MODE,
    FLASH_WIZARD_STEPS,
    SELECT_MODE_WIZARD,
    SELECT_PORT_WIZARD,
    STEP_ACTION,
} from '@interfaces/enums'
import { setAction, setSelectedMode, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { setActiveAction } from '@store/ui/ui'
import { BiRegularChip } from 'solid-icons/bi'
import { batch, Match, Switch } from 'solid-js'

const SelectModeWizard = () => {
    return (
        <Switch>
            <Match when={activeStep() === SELECT_MODE_WIZARD.SELECT_MODE}>
                <Card
                    secondaryButtonLabel="Wi-Fi mode"
                    onClickOptionLabel="Wired Mode"
                    icon={BiRegularChip}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS_SUCCESS)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setSelectedMode(FLASH_MODE.WIRELESS)
                            setActiveAction(STEP_ACTION.SELECT_MODE)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT_BEFORE_PROCEEDING)
                        })
                    }}
                    onClickOption={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setSelectedMode(FLASH_MODE.WIRED)
                            setActiveAction(STEP_ACTION.SELECT_MODE)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT_BEFORE_PROCEEDING)
                        })
                    }}
                    label="Select Mode">
                    <Typography text="caption" color="white">
                        How should your device work?
                        <br />
                        Pick USB for a <code class="text-purple-100">wired connection </code> or
                        Wi-Fi for <code class="text-purple-100">wireless</code>
                    </Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default SelectModeWizard
