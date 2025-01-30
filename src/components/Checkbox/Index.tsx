import { Component } from 'solid-js'

export interface IProps {
    checked: boolean
}

const Checkbox: Component<IProps> = (props) => {
    return (
        <div
            classList={{ 'bg-purple-200': props.checked }}
            class="w-14 h-14 border border-solid border-purple-200 rounded-4"
        />
    )
}

export default Checkbox
