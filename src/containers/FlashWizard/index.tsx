import SwipeAnimation from '@components/SwipeAnimation'
import { WIRELESS_WIZARD_STEPS } from '@interfaces/enums'
import { classNames } from '@src/utils'
import { activeStep } from '@store/animation/selectors'
import { createMemo } from 'solid-js'
import ChangeDeviceModeWizard from './ChangeDeviceModeWizard'
import FlashWizard from './FlashWizard'
import SelectModeWizard from './SelectModeWizard'
import SelectPortWizard from './SelectPortWizard'
import SetupWizard from './SetupWizard'
import TerminalWizard from './TerminalWizard'
import WiredWizard from './WiredWizard'
import WirelessWizard from './WirelessWizard'
import UpdateNetworkWizard from './UpdateNetworkWizard'

const FlashWizardRoot = () => {
    const maxSize = createMemo(() => {
        if (activeStep() === WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK) {
            return 'min-h-[480px] max-w-[720px] w-full mx-24'
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
                    <SetupWizard />
                    <FlashWizard />
                    <TerminalWizard />
                    <SelectModeWizard />
                    <SelectPortWizard />
                    <UpdateNetworkWizard />
                    <ChangeDeviceModeWizard />
                    <WirelessWizard />
                    <WiredWizard />
                </SwipeAnimation>
            </div>
        </div>
    )
}

export default FlashWizardRoot
