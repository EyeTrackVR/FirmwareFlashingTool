import MinusButton from '@components/Buttons/MinusButton'
import PlusButton from '@components/Buttons/PlusButton'
import Typography from '@components/Typography'
import theme from '@src/common/theme'
import { IoCamera } from 'solid-icons/io'
import { Component, createEffect, createSignal } from 'solid-js'
import RangeSlider from '@components/Inputs/RangeSlider'

export interface IProps {
    onChangeRotation: (value: number) => void
}

const CameraRotationPanel: Component<IProps> = (props) => {
    const [rotation, setRotation] = createSignal(0)
    const MIN_RANGE = 0
    const MAX_RANGE = 360

    createEffect(() => {
        props.onChangeRotation(rotation())
    })

    return (
        <div class="flex flex-col gap-24 bg-black-900 p-24 rounded-12 border border-solid border-black-800 min-[1001px]:max-w-[600px] w-full">
            <div class="flex gap-12 items-center">
                <div class="bg-purple-300 rounded-md flex p-6 rounded-6">
                    <IoCamera size={24} color={theme.colors.white[100]} />
                </div>
                <Typography color="white" text="body">
                    Camera settings
                </Typography>
            </div>
            <div class="text-left">
                <Typography color="white" text="caption">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium.
                </Typography>
            </div>
            <div class="flex flex-col text-left gap-6">
                <Typography color="white" text="caption">
                    Rotation
                </Typography>
                <div class="flex flex-row gap-12 items-center justify-center">
                    <MinusButton
                        onClick={() => {
                            setRotation((prev) => Math.max(MIN_RANGE, prev - 1))
                        }}
                    />
                    <RangeSlider
                        max={MAX_RANGE}
                        min={MIN_RANGE}
                        value={rotation()}
                        onChange={(value) => {
                            setRotation(value)
                        }}
                    />
                    <PlusButton
                        onClick={() => {
                            setRotation((prev) => Math.min(MAX_RANGE, prev + 1))
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CameraRotationPanel
