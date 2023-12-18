import type { Component } from 'solid-js'

interface IProps {
    onChange: (value: string) => void
    placeholder: string
    type?: string
    id?: string
    required?: boolean
    value: string
    autoFocus?: boolean
}

const Input: Component<IProps> = (props) => {
    return (
        <input
            autofocus={props.autoFocus}
            class="h-[39px] bg-[#192736] w-full rounded-[6px] border-solid border-1 border-[#192736] placeholder-white text-[12px] text-white focus:border-817DF7  focus:border-[#192736] focus:ring-[#817DF7]"
            onInput={(e) => props.onChange((e.target as HTMLInputElement).value)}
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
