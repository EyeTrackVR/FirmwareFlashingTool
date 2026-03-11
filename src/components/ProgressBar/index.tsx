import { Component } from 'solid-js'

interface IProps {
    duration: number
    color: string
    paused: boolean
}

const ProgressBar: Component<IProps> = (props) => (
    <div class="absolute bottom-0 left-0 right-0 h-2 overflow-hidden rounded-tl-xl rounded-tr-xl">
        <div
            class="h-full rounded-sm origin-left animate-shrink"
            style={{
                'animation-duration': `${props.duration}ms`,
                'animation-play-state': props.paused ? 'paused' : 'running',
                background: props.color,
            }}
        />
    </div>
)

export default ProgressBar
