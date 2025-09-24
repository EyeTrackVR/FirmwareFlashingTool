import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import {
    ACTION,
    FLASH_WIZARD_STEPS,
    INIT_WIZARD_STEPS,
    TERMINAL_WIZARD_STEPS,
} from '@interfaces/enums'
import { IFirmwareState } from '@interfaces/interfaces'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { firmwareState, isActiveProcess, percentageProgress } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { IoCheckmarkSharp } from 'solid-icons/io'
import { Accessor, batch, createMemo, Match, Switch } from 'solid-js'

const FlashProcessWizard = () => {
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
                            setStep(INIT_WIZARD_STEPS.SELECT_PORT)
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
                            setStep(INIT_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(TERMINAL_WIZARD_STEPS.TERMINAL_BEFORE_PROCEEDING)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(FLASH_WIZARD_STEPS.SELECT_MODE)
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
                            setAbortController('openiris')
                            setStep(INIT_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setAbortController('openiris')
                            setStep(INIT_WIZARD_STEPS.SELECT_PORT)
                        })
                    }}
                    label="Failed to flash board">
                    <Typography color="red">
                        {!flashFirmwareState()?.label
                            ? 'Something went wrong, please contact with us on discord'
                            : (flashFirmwareState()?.label ??
                              'Something went wrong, please try again')}
                    </Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default FlashProcessWizard
