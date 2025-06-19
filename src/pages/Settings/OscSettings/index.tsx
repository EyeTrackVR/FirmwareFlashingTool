import AdvancedDropdown from '@components/AdvancedDropdown'
import Button from '@components/Buttons/Button'
import { ToggleButton } from '@components/Buttons/ToggleButton'
import Input from '@components/Inputs/Input'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { VsSettings } from 'solid-icons/vs'

const OscSettings = () => {
    return (
        <section class="w-full  pt-8 pb-12 flex flex-col gap-12">
            <div class="w-full flex flex-row justify-end pr-24">
                <Button label="Reset settings to default" isDangerous />
            </div>
            <div class="flex flex-col gap-12 overflow-y-auto scrollbar pr-24 h-full">
                <ContextWrapper
                    icon={VsSettings}
                    iconColor="white"
                    label="OSC Settings"
                    description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                    <div class="flex flex-col gap-24">
                        <div class="flex flex-col gap-12 items-start">
                            <Typography text="caption" color="white">
                                Lorem ipsum
                            </Typography>
                            <div class="flex flex-row gap-24">
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton onToggle={() => {}} isToggled={false} />
                                    <Typography color="white" text="caption" nowrap>
                                        Mirror eyes
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton onToggle={() => {}} isToggled={false} />
                                    <Typography color="white" text="caption" nowrap>
                                        sync blink
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-12 items-start">
                            <Typography text="caption" color="white">
                                Lorem ipsum
                            </Typography>
                            <div class="flex flex-row gap-24">
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton onToggle={() => {}} isToggled={false} />
                                    <Typography color="white" text="caption" nowrap>
                                        Enable sending
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton onToggle={() => {}} isToggled={false} />
                                    <Typography color="white" text="caption" nowrap>
                                        Enable receiving
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-12 items-start">
                            <Typography text="caption" color="white">
                                Lorem ipsum
                            </Typography>
                            <div class="flex flex-row items-center gap-6">
                                <ToggleButton onToggle={() => {}} isToggled={false} />
                                <Typography color="white" text="caption" nowrap>
                                    vrchat native tracking
                                </Typography>
                            </div>
                        </div>
                    </div>
                </ContextWrapper>
                <div>
                    <AdvancedDropdown>
                        <ContextWrapper
                            icon={VsSettings}
                            iconColor="white"
                            label="Address and ports"
                            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                            <div class="flex flex-col gap-24">
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Network address
                                    </Typography>
                                    <Input onChange={() => {}} placeholder="127.0.0.1" value="" />
                                </div>
                                <div class="flex flex-row items-center gap-6 w-full">
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Sending port
                                        </Typography>
                                        <Input onChange={() => {}} placeholder="9000" value="" />
                                    </div>
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Receiver port
                                        </Typography>
                                        <Input onChange={() => {}} placeholder="9001" value="" />
                                    </div>
                                </div>
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Eyes Y
                                    </Typography>
                                    <Input
                                        onChange={() => {}}
                                        placeholder="/avatar/parameters/EyesY"
                                        value=""
                                    />
                                </div>
                            </div>
                        </ContextWrapper>
                        <ContextWrapper
                            icon={VsSettings}
                            iconColor="white"
                            label="VRCFT v1 endpoints"
                            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                            <div class="flex flex-col gap-24">
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Recalibrate
                                    </Typography>
                                    <Input
                                        onChange={() => {}}
                                        placeholder="/avatar/parameters/etvr_recalibrate"
                                        value=""
                                    />
                                </div>
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Sync blink
                                    </Typography>
                                    <Input
                                        onChange={() => {}}
                                        placeholder="/avatar/parameters/etvr_sync_blink"
                                        value=""
                                    />
                                </div>
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Recenter
                                    </Typography>
                                    <Input
                                        onChange={() => {}}
                                        placeholder="/avatar/parameters/etvr_recenter"
                                        value=""
                                    />
                                </div>
                                <div class="flex flex-row items-center gap-6 w-full">
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Left eye X
                                        </Typography>
                                        <Input
                                            onChange={() => {}}
                                            placeholder="/avatar/parameters/LeftEyeX"
                                            value=""
                                        />
                                    </div>
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Right eye X
                                        </Typography>
                                        <Input
                                            onChange={() => {}}
                                            placeholder="/avatar/parameters/RightEyeX"
                                            value=""
                                        />
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-6 w-full">
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Left eye blink
                                        </Typography>
                                        <Input
                                            onChange={() => {}}
                                            placeholder="/avatar/parameters/LeftEyeLidExpandedSqueeze"
                                            value=""
                                        />
                                    </div>
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Right eye blink
                                        </Typography>
                                        <Input
                                            onChange={() => {}}
                                            placeholder="/avatar/parameters/RightEyeLidExpandedSqueeze"
                                            value=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </ContextWrapper>
                    </AdvancedDropdown>
                </div>
            </div>
        </section>
    )
}

export default OscSettings
