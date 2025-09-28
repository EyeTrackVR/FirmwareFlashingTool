import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import { ACTION, FLASH_MODE, FLASH_WIZARD_STEPS, PORT_WIZARD_STEPS } from '@interfaces/enums'
import { setAction, setSelectedMode, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { BiRegularChip } from 'solid-icons/bi'
import { batch, Match, Switch } from 'solid-js'

const SelectModeWizard = () => {
    return (
        <Switch>
            <Match when={activeStep() === FLASH_WIZARD_STEPS.SELECT_MODE}>
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
                            setStep(PORT_WIZARD_STEPS.PORT_BEFORE_PROCEEDING)
                            setSelectedMode(FLASH_MODE.WIRELESS)
                        })
                    }}
                    onClickOption={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(PORT_WIZARD_STEPS.PORT_BEFORE_PROCEEDING)
                            setSelectedMode(FLASH_MODE.WIRED)
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
