import Card from '@components/Cards/Card'
import Typography from '@components/Typography'
import { ACTION, SELECT_PORT_WIZARD, UPDATE_NETWORK_WIZARD } from '@interfaces/enums'
import { verifyBoardMode } from '@store/actions/animation/verifyBoardMode'
import { verifyPortConnection } from '@store/actions/animation/verifyPortConnection'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep } from '@store/animation/selectors'
import { BiRegularError, BiRegularLoaderAlt } from 'solid-icons/bi'
import { RiSystemInformationLine } from 'solid-icons/ri'
import { batch, Match, Switch } from 'solid-js'

const UpdateNetworkWizard = () => {
    return (
        <Switch>
            <Match when={activeStep() === UPDATE_NETWORK_WIZARD.UPDATE_NETWORK_CHECK_MODE}>
                <Card isLoader icon={BiRegularLoaderAlt} label="Verifying mode">
                    <Typography text="caption" color="white" class="leading-[18px]">
                        Verifying active mode, please stand by…
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === UPDATE_NETWORK_WIZARD.UPDATE_SWITCHING_MODE}>
                <Card isLoader icon={BiRegularLoaderAlt} label="Switching mode">
                    <Typography text="caption" color="white" class="leading-[18px]">
                        Switching to wireless mode, please stand by…
                    </Typography>
                </Card>
            </Match>

            <Match when={activeStep() === UPDATE_NETWORK_WIZARD.UPDATE_NETWORK_VERYFICATION_FAILED}>
                <Card
                    status="fail"
                    primaryButtonLabel="Try again"
                    secondaryButtonLabel="Back"
                    isActive
                    icon={BiRegularError}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            verifyBoardMode(['wifi', 'auto']).catch(() => {})
                            setStep(UPDATE_NETWORK_WIZARD.UPDATE_NETWORK_CHECK_MODE, false)
                        })
                    }}
                    label="Connection failed">
                    <Typography color="white">
                        Failed to retrieve information about the current active mode
                    </Typography>
                </Card>
            </Match>
            <Match when={activeStep() === UPDATE_NETWORK_WIZARD.UPDATE_NETWORK_INVALID_MODE}>
                <Card
                    primaryButtonLabel="Switch mode"
                    secondaryButtonLabel="Back"
                    isActive
                    icon={RiSystemInformationLine}
                    onClickBack={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                        })
                    }}
                    onClickSecondary={() => {
                        batch(() => {
                            setAction(ACTION.PREV)
                            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            verifyPortConnection(false, 'wifi').catch(() => {})
                            setStep(UPDATE_NETWORK_WIZARD.UPDATE_SWITCHING_MODE, false)
                        })
                    }}
                    label="Invalid Mode">
                    <Typography color="white" class="leading-[30px]">
                        Invalid mode. To update the network, you must be in Wireless mode. Press the{' '}
                        <code class="code">Switch mode</code> button to change to Wireless mode.
                    </Typography>
                </Card>
            </Match>
        </Switch>
    )
}

export default UpdateNetworkWizard
