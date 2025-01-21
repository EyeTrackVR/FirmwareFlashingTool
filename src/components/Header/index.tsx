import { ProgressBar } from '@components/ProgressBar'
import Typography from '@components/Typography'
import { Image } from '@kobalte/core'
import { Component } from 'solid-js'

interface IProps {
    onClick: () => void
    step: { step: string; description: string; dashoffset: string; index: string }
    currentStep: string
    name: string
}

const MainHeader: Component<IProps> = (props) => {
    return (
        <header class="w-full">
            <div class="flex justify-between">
                <div
                    class="flex cursor-pointer"
                    onClick={() => {
                        props.onClick()
                    }}>
                    <div class="flex items-end">
                        <div>
                            <Image.Root>
                                <Image.Img
                                    src="images/logo.png"
                                    alt="logo"
                                    width="64px"
                                    class="min-w-[64px]"
                                />
                            </Image.Root>
                        </div>
                        <Typography color="white" text="h3" class="pb-2">
                            EyetrackVR
                        </Typography>
                    </div>
                </div>
                <div class="flex flex-row justify-center items-center gap-6 min-w-[210px]">
                    <ProgressBar
                        currentStep={props.currentStep}
                        dashoffset={props.step.dashoffset}
                    />
                    <div class="flex flex-col items-start justify-end w-full gap-4">
                        <Typography color="white" text="captionBold">
                            {props.step.step}
                        </Typography>
                        <Typography color="white" text="small">
                            {props.step.description}
                        </Typography>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default MainHeader
