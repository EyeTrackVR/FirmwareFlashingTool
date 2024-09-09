import { Component, createMemo } from 'solid-js'

interface IProps {
    onInput: (value: string) => void
    value: number
    min: string
    max: string
}

const Index: Component<IProps> = (props) => {
    const bubblePosition = createMemo(() => {
        const negNewVal = -1 * props.value
        return {
            left: props.value + '%',
            transform: 'translate(' + negNewVal + '%, 2px)',
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

export default Index
