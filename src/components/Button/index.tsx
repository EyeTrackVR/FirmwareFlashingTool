import { Button } from '@kobalte/core'
import { Component, JSX, Show } from 'solid-js'
import './styles.css'

export interface Iprops {
    color: string
    onClick?: () => void
    text?: string
    shadow?: string
    children?: JSX.Element
}

const WebSerialButton: Component<Iprops> = (props) => {
    const handleOnClick = (e: Event) => {
        e.preventDefault()
        if (props.onClick) {
            props.onClick()
        }
    }

    return (
        <Button.Root
            class="button"
            style={{ background: props.color, 'box-shadow': props.shadow }}
            onClick={handleOnClick}>
            <Show fallback={props.text} when={props.children}>
                {props.children}
            </Show>
        </Button.Root>
    )
}

export default WebSerialButton
