import Button from '@components/Buttons/Button'
import { ToggleButton } from '@components/Buttons/ToggleButton'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { FaSolidArrowsToEye } from 'solid-icons/fa'

const GeneralSettings = () => {
    return (
        <div class="w-full pr-24 pt-8 flex flex-col gap-12">
            <div class="w-full flex flex-row justify-end ">
                <Button label="Reset settings to default" isDangerous />
            </div>
            <ContextWrapper
                icon={FaSolidArrowsToEye}
                iconColor="white"
                label="Eye falloff settings"
                description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                <div class="flex flex-col">
                    <div class="flex flex-row items-center gap-6">
                        <ToggleButton onToggle={() => {}} isToggled={false} />
                        <Typography color="white" text="caption" nowrap>
                            Outer Eye Falloff
                        </Typography>
                    </div>
                </div>
            </ContextWrapper>
        </div>
    )
}

export default GeneralSettings
