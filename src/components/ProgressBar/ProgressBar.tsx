import { Component } from 'solid-js'
import { CIRCLE_RADIUS } from '@src/static'
import './styles.css'
export interface IProps {
    currentStep: string
    dashoffset: string
}

export const ProgressBar: Component<IProps> = (props) => {
    return (
        <div class="relative">
            <div class="step">
                <p class="text-white text-[16px] font-medium">{props.currentStep}</p>
            </div>
            <svg id="svg" width="60" height="60" version="1.1">
                <circle
                    r={CIRCLE_RADIUS}
                    cx="30"
                    cy="30"
                    fill="transparent"
                    stroke-dasharray="157"
                    stroke-dashoffset="0"
                    stroke-width="4"
                />
                <circle
                    stroke-width="4"
                    id="bar"
                    r={CIRCLE_RADIUS}
                    cx="30"
                    cy="30"
                    fill="transparent"
                    stroke-dasharray="157"
                    stroke-dashoffset={props.dashoffset}
                />
            </svg>
        </div>
    )
}
