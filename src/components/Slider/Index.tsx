import { Component, createMemo } from 'solid-js'

interface IProps {
    onInput: (value: string) => void
    value: number
    min: number
    max: number
}

const Slider: Component<IProps> = (props) => {
    const bubblePosition = createMemo(() => {
        const percentage = (props.value / props.max) * 100
        return {
            left: percentage + '%',
            transform: 'translate(' + -percentage + '%, 2px)',
        }
    })

    return (
        <div class="input-container">
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={props.value}
                class="inputSlider"
                onInput={(e) => props.onInput(e.target.value)}
            />
            <div class="range-text" style={bubblePosition()}>
                <p>{props.value}</p>
            </div>
        </div>
    )
}

export default Slider
