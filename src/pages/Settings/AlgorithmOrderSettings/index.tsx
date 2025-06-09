import Button from '@components/Buttons/Button'
import { ToggleButton } from '@components/Buttons/ToggleButton'
import Camera from '@components/Camera/Camera'
import Tooltip from '@components/Tooltip'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { FaSolidCode } from 'solid-icons/fa'

const AlgorithmOrderSettings = () => {
    return (
        <section class="w-full pr-24 pt-8 flex flex-col gap-12">
            <div class="w-full flex flex-row justify-end ">
                <Button label="Reset settings to default" isDangerous />
            </div>
            <div class="flex flex-row gap-12">
                <ContextWrapper
                    icon={FaSolidCode}
                    iconColor="white"
                    label="Tracking algorithm order settings"
                    description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                    <div class="flex flex-col gap-12 items-start">
                        <Typography text="caption" color="white">
                            Lorem ipsum
                        </Typography>
                        <div class="flex flex-row gap-24 w-full">
                            <div class="flex flex-col gap-24 w-full">
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton onToggle={() => {}} isToggled={false} />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        LEAP
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton onToggle={() => {}} isToggled={false} />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        BLOB
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton onToggle={() => {}} isToggled={false} />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        HSRAC
                                    </Typography>
                                </div>
                            </div>
                            <div class="flex flex-col gap-24 w-full">
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton onToggle={() => {}} isToggled={false} />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        RANSAC
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton onToggle={() => {}} isToggled={false} />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        HSF
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton onToggle={() => {}} isToggled={false} />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        AHSF
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContextWrapper>
                <div class="relative min-w-[240px] max-w-[240px] max-h-[240px] min-h-[240px] flex flex-col gap-24 bg-black-900 p-24 rounded-12 border border-solid border-black-800">
                    <Camera
                        streamSource={
                            'http://127.0.0.1:8855/etvr/feed/3964109a-8b57-4417-b3cc-a0a1ba12391e/camera'
                        }
                    />
                </div>
            </div>
        </section>
    )
}

export default AlgorithmOrderSettings
