import { Component } from 'solid-js'

interface IProps {
    duration: number
    color: string
    paused: boolean
}

const ProgressBar: Component<IProps> = (props) => (
    <div class="absolute bottom-0 left-0 right-0 h-2 overflow-hidden rounded-tr-12 rounded-tl-12">
        <div
            class="h-full rounded-2"
            style={{
                'animation-play-state': props.paused ? 'paused' : 'running',
                animation: `shrink ${props.duration}ms linear forwards`,
                'transform-origin': 'left',
                background: props.color,
            }}
        />
    </div>
)

export default ProgressBar
