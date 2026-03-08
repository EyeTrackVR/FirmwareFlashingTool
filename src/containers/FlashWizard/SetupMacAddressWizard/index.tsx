import Card from '@components/Cards/Card'
import Input from '@components/Inputs/Input'
import Typography from '@components/Typography'
import { ACTION, SETUP_MAC_ADDRESS, WIRELESS_WIZARD_STEPS } from '@interfaces/animation/enums'
import { formatMac, isValidMac } from '@src/utils'
import { setAction, setStep } from '@store/animation/animation'
import { activeStep, prevStep } from '@store/animation/selectors'
import { setMac } from '@store/network/network'
import { mac } from '@store/network/selectors'
import { FaSolidWifi } from 'solid-icons/fa'
import { batch, Match, Switch } from 'solid-js'

const SetupMacAddressWizard = () => {
    return (
        <Switch>
            <Match when={activeStep() === SETUP_MAC_ADDRESS.SETUP_MAC_ADDRESS}>
                <Card
                    label="Setup MAC address"
                    primaryButtonLabel="Continue"
                    isActive={isValidMac(mac())}
                    icon={FaSolidWifi}
                    onClickBack={() => {
                        const previous = prevStep()
                        batch(() => {
                            setAction(ACTION.PREV)
                            if (previous === WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP) {
                                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_MANUAL_SETUP)
                            } else {
                                setStep(previous)
                            }
                        })
                    }}
                    onClickPrimary={() => {
                        batch(() => {
                            setAction(ACTION.NEXT)
                            setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_MDNS, false)
                        })
                    }}>
                    <div class="flex flex-col gap-6">
                        <Typography color="white" text="caption">
                            Please enter the hardware MAC address of your device to continue
                            configuration.
                        </Typography>
                    </div>
                    <div class="flex flex-col gap-10 w-full">
                        <Typography color="white" text="caption" class="text-left">
                            Device MAC Address
                        </Typography>
                        <Input
                            id="mac"
                            type="text"
                            onChange={(inputValue: string) => {
                                const formatted = formatMac(inputValue)
                                setMac(formatted)
                            }}
                            value={mac()}
                            placeholder={'00:00:00:00:00:00'}
                        />
                    </div>
                </Card>
            </Match>
        </Switch>
    )
}

export default SetupMacAddressWizard
