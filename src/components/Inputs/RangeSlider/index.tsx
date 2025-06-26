import Typography from '@components/Typography'
import { Component, createEffect, createSignal, onCleanup, onMount } from 'solid-js'
interface IProps {
    disabled?: boolean
    onChange: (value: number) => void
    value: number
    min: number
    max: number
}

export const RangeSlider: Component<IProps> = (props) => {
    const [rightFillWidth, setRightFillWidth] = createSignal('100%')
    const [leftFillWidth, setLeftFillWidth] = createSignal('0px')
    const [position, setPosition] = createSignal('0px')

    let controlRef: HTMLDivElement | undefined
    let trackRef: HTMLDivElement | undefined
    const INDICATOR_WIDTH = 45

    const calculatePosition = (val: number, trackWidth: number) => {
        const range = props.max - props.min
        const percentage = (val - props.min) / range
        const availableWidth = trackWidth - INDICATOR_WIDTH
        return percentage * availableWidth
    }

    const updatePositionAndFills = (val: number) => {
        if (!trackRef) return

        const trackWidth = trackRef.clientWidth
        const absolutePosition = calculatePosition(val, trackWidth)

        setPosition(`${absolutePosition}px`)
        setLeftFillWidth(`${absolutePosition}px`)
        setRightFillWidth(`${trackWidth - absolutePosition - INDICATOR_WIDTH}px`)
    }

    const updateValue = (newValue: number) => {
        const clampedValue = Math.max(props.min, Math.min(props.max, newValue))
        props.onChange(clampedValue)
        updatePositionAndFills(clampedValue)
    }

    onMount(() => {
        updatePositionAndFills(props.value)
        if (!controlRef) return

        const resizeObserver = new ResizeObserver(() => {
            updatePositionAndFills(props.value)
        })

        resizeObserver.observe(controlRef)
        onCleanup(() => resizeObserver.disconnect())
    })

    createEffect(() => {
        updatePositionAndFills(props.value)
    })

    return (
        <div class="relative grid place-items-center mx-auto w-full" ref={controlRef}>
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={props.value}
                disabled={props.disabled}
                onInput={(e) => {
                    updateValue(parseInt(e.target.value))
                }}
                classList={{
                    '[&::-webkit-slider-thumb]:!cursor-not-allowed': props.disabled,
                }}
                class="w-full h-40 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[45px] [&::-webkit-slider-thumb]:h-[32px] [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:bg-[#9092ff] [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:mt-[-16px] [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:top-[8px] [&::-moz-range-thumb]:w-[25px] [&::-moz-range-thumb]:h-[45px] [&::-moz-range-thumb]:rounded [&::-moz-range-thumb]:bg-[#9092ff] [&::-moz-range-thumb]:cursor-default [&::-moz-range-thumb]:border-none [&::-ms-thumb]:w-[45px] [&::-ms-thumb]:h-[45px] [&::-ms-thumb]:rounded [&::-ms-thumb]:bg-[#9092ff] [&::-ms-thumb]:cursor-default hover:cursor-default focus-visible:outline-offset-[15px] focus-visible:outline-transparent"
            />
            <div
                class="h-40 w-full absolute bottom-0 pointer-events-none z-[5] overflow-hidden rounded-6"
                ref={trackRef}>
                <div
                    class="h-full w-full relative"
                    style={{
                        position: 'absolute',
                        left: position(),
                        width: `${INDICATOR_WIDTH}px`,
                    }}>
                    <div
                        class="w-full h-40 absolute rounded-6 bg-black-800 right-[calc(50%+30px)]"
                        style={{ width: leftFillWidth() }}
                    />
                    <div class="rounded-4 w-[45px] h-[32px] absolute top-1/2 left-1/2 flex justify-center items-center bg-purple-300 z-[5] -translate-x-1/2 -translate-y-1/2">
                        <Typography color="white" text="caption">
                            {props.value}
                        </Typography>
                    </div>
                    <div
                        class="w-full h-40 absolute rounded-6 bg-black-800 left-[calc(50%+30px)]"
                        style={{ width: rightFillWidth() }}
                    />
                </div>
            </div>
        </div>
    )
}

export default RangeSlider
