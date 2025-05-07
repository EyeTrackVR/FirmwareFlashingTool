import MinusButton from '@components/Buttons/MinusButton'
import PlusButton from '@components/Buttons/PlusButton'
import RangeSlider from '@components/Inputs/RangeSlider'
import Typography from '@components/Typography'
import theme from '@src/common/theme'
import { IoCamera } from 'solid-icons/io'
import { Component } from 'solid-js'

export interface IProps {
    onChangeRotation: (value: number) => void
    rotation: number
}

const CameraRotationPanel: Component<IProps> = (props) => {
    const MAX_RANGE = 360
    const MIN_RANGE = 0

    const handleRotationChange = (newValue) => {
        if (newValue !== props.rotation) {
            props.onChangeRotation(newValue)
        }
    }

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
                            const newValue = Math.max(MIN_RANGE, props.rotation - 1)
                            handleRotationChange(newValue)
                        }}
                    />
                    <RangeSlider
                        max={MAX_RANGE}
                        min={MIN_RANGE}
                        value={props.rotation}
                        onChange={handleRotationChange}
                    />
                    <PlusButton
                        onClick={() => {
                            const newValue = Math.min(MAX_RANGE, props.rotation + 1)
                            handleRotationChange(newValue)
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CameraRotationPanel
