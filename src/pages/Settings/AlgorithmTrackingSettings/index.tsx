import AdvancedDropdown from '@components/AdvancedDropdown'
import Button from '@components/Buttons/Button'
import { ToggleButton } from '@components/Buttons/ToggleButton'
import RangeSlider from '@components/Inputs/RangeSlider'
import Tooltip from '@components/Tooltip'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { VsSettings } from 'solid-icons/vs'

const AlgorithmTrackingSettings = () => {
    return (
        <section class="w-full pr-24 pt-8 flex flex-col gap-12">
            <div class="w-full flex flex-row justify-end ">
                <Button label="Reset settings to default" isDangerous />
            </div>
            <AdvancedDropdown>
                <ContextWrapper
                    icon={VsSettings}
                    iconColor="white"
                    label="Advanced tracking alghoritm settings"
                    description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                    <div class="flex flex-col gap-24">
                        <div class="flex flex-row gap-24">
                            <div class="flex flex-row items-center gap-6">
                                <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                    <ToggleButton onToggle={() => {}} isToggled={false} />
                                </Tooltip>
                                <Typography color="white" text="caption" nowrap>
                                    Skip auto radius
                                </Typography>
                            </div>
                            <div class="flex flex-row items-center gap-6">
                                <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                    <ToggleButton onToggle={() => {}} isToggled={false} />
                                </Tooltip>
                                <Typography color="white" text="caption" nowrap>
                                    Skip Blink detection
                                </Typography>
                            </div>
                        </div>
                        <div class="flex flex-col items-start gap-6">
                            <Typography text="caption" color="white">
                                Blink stat frames
                            </Typography>
                            <RangeSlider max={180} min={1} value={1} onChange={() => {}} />
                        </div>
                    </div>
                </ContextWrapper>
            </AdvancedDropdown>
        </section>
    )
}

export default AlgorithmTrackingSettings
