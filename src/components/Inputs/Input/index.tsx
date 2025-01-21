import type { Component } from 'solid-js'

interface IProps {
    onChange: (value: string) => void
    placeholder: string
    type?: string
    id?: string
    required?: boolean
    value: string
    autoFocus?: boolean
    autoComplete?: string
}

const Input: Component<IProps> = (props) => {
    return (
        <input
            autocomplete={props.autoComplete}
            autofocus={props.autoFocus}
            class="h-[39px] bg-black-800 w-full rounded-6 border-solid border-1 border-black-800 placeholder-white-100 text-[12px] text-white-100 focus:border-black-800 focus:ring-purple-200"
            onInput={(e) => {
                props.onChange(e.currentTarget.value)
                e.currentTarget.value = props.value
            }}
            placeholder={props.placeholder}
            type={props.type}
            name={props.id}
            value={props.value}
            id={props.id}
            required={props.required}
        />
    )
}

export default Input
