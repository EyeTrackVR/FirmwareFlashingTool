import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import {
    ACTION,
    FLASH_MODE,
    FLASH_WIZARD_STEPS,
    PORT_WIZARD_STEPS,
    WIRELESS_WIZARD_STEPS,
} from '@interfaces/enums'
import SwipeAnimation from '@src/Animation'
import { classNames } from '@src/utils'
import { setAction, setSelectedMode, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { BiRegularChip } from 'solid-icons/bi'
import { batch, createMemo, Match, Switch } from 'solid-js'
import FlashProcessWizard from './FlashProcessWizard'
import SelectPortWizard from './SelectPortWizard'
import SetupProcessWizard from './SetupProcessWizard'
import TerminalProcessWizard from './TerminalProcessWizard'
import WiredProcessWizard from './WiredProcessWizard'
import WirelessProcessWizard from './WirelessProcessWizard'

const FlashWizard = () => {
    const maxSize = createMemo(() => {
        if (activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK) {
            return 'h-[480px] max-w-[720px] w-full mx-24'
        }
        return 'min-h-[480px] max-w-[420px] w-full mx-24'
    })

    return (
        <div class="flex w-full h-full items-center justify-center">
            <div
                class={classNames(
                    'bg-black-900 flex border relative bottom-[20px] overflow-hidden border-solid border-black-800 rounded-12 flex-col items-center justify-between duration-180 transition-all ease-in-out',
                    maxSize(),
                )}>
                <SwipeAnimation>
                    <SetupProcessWizard />
                    <FlashProcessWizard />
                    <TerminalProcessWizard />
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
                                    Pick USB for a{' '}
                                    <code class="text-purple-100">wired connection </code> or Wi-Fi
                                    for <code class="text-purple-100">wireless</code>
                                </Typography>
                            </Card>
                        </Match>
                    </Switch>
                    <SelectPortWizard />
                    <WirelessProcessWizard />
                    <WiredProcessWizard />
                </SwipeAnimation>
            </div>
        </div>
    )
}

export default FlashWizard
