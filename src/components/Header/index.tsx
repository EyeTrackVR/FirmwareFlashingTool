import { Image } from '@kobalte/core'
import { Component } from 'solid-js'
import { ProgressBar } from '@components/ProgressBar/ProgressBar'
import './styles.css'

interface Iprops {
    onClick: () => void
    step: { step: string; description: string; dashoffset: string; index: string }
    currentStep: string
    name: string
}

const MainHeader: Component<Iprops> = (props) => {
    return (
        <header class="w-full pt-[37px] pr-[40px] pl-[40px] ">
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
                        <div class="pb-2 text-[20px] leading-20 text-white">
                            <p>EyetrackVR</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row justify-center items-center gap-[6px] min-w-[210px]">
                    <ProgressBar
                        currentStep={props.currentStep}
                        dashoffset={props.step.dashoffset}
                    />
                    <div class="flex flex-col  items-start justify-end w-full">
                        <div class="text-white text-[14px] font-bold leading-normal">
                            <p>{props.step.step}</p>
                        </div>
                        <div class="text-white font-inter text-[12px] font-normal leading-normal">
                            <p>{props.step.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default MainHeader
