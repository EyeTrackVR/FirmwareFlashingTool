import Card from '@components/Card'
import Typography from '@components/Typography'
import { ACTION, FLASH_WIZARD_STEPS } from '@interfaces/enums'
import SwipeAnimation from '@src/Animation'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { BiRegularChip } from 'solid-icons/bi'
import { batch, Match, Switch } from 'solid-js'
import FlashProcessWizard from './FlashProcessWizard'
import SetupProcessWizard from './SetupProcessWizard'
import WiredProcessWizard from './WiredProcessWizard'
import WirelessProcessWizard from './WirelessProcessWizard'

const FlashWizard = () => {
    return (
        <div class="flex w-full h-full items-center justify-center">
            <div class="bg-black-900 flex border relative bottom-[20px] overflow-hidden border-solid border-black-800 rounded-12 flex-col items-center justify-between min-h-[480px] w-[420px]">
                <SwipeAnimation>
                    <SetupProcessWizard />
                    <FlashProcessWizard />
                    <Switch>
                        <Match when={activeStep() === FLASH_WIZARD_STEPS.SELECT_MODE}>
                            <Card
                                secondaryButtonLabel="Wi-Fi mode"
                                onClickOptionLabel="Wired Mode"
                                icon={BiRegularChip}
                                onClickBack={() => {
                                    batch(() => {
                                        setAction(ACTION.PREV)
                                        setStep(FLASH_WIZARD_STEPS.BEFORE_CONTINUE_CONFIG)
                                    })
                                }}
                                onClickSecondary={() => {}}
                                onClickOption={() => {
                                    batch(() => {
                                        setAction(ACTION.NEXT)
                                        setStep(FLASH_WIZARD_STEPS.SETUP_TRACKER_NAME)
                                    })
                                }}
                                label="Select Mode">
                                <Typography text="caption" color="white">
                                    How should your device work?
                                    <br />
                                    Pick USB for a{' '}
                                    <code class="text-purple-100">wired connection </code> or Wi-Fi
                                    for <code class="text-purple-100">wireless</code>
                                </Typography>
                            </Card>
                        </Match>
                    </Switch>
                    <WiredProcessWizard />
                    <WirelessProcessWizard />
                </SwipeAnimation>
            </div>
        </div>
    )
}

export default FlashWizard
