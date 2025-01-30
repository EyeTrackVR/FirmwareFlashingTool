import { FaRegularEye, FaRegularEyeSlash } from 'solid-icons/fa'
import { createSignal, type Component } from 'solid-js'

interface IProps {
    onChange: (value: string) => void
    placeholder: string
    value: string
    autoFocus?: boolean
    required?: boolean
}

const PasswordInput: Component<IProps> = (props) => {
    const [active, setActive] = createSignal<boolean>(false)
    const [showPassword, setShowPassword] = createSignal<boolean>(false)

    return (
        <div
            classList={{
                'border-solid border-1 border-purple-200': active(),
                'border-solid border-1 border-black-800': !active(),
            }}
            class="flex justify-center items-center p-6 h-[39px] bg-black-800 w-full rounded-6 placeholder-white-100 text-white-100">
            <input
                required={props.required}
                autofocus={props.autoFocus}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                class="h-full pl-6 pr-6 bg-black-800 w-full rounded-6 border-solid border-0 focus:ring-0 focus:ring-black-800 border-black-800 placeholder-white-100 text-[12px] text-white-100 focus:border-0 focus:border-black-800"
                onInput={(e) => {
                    props.onChange(e.currentTarget.value)
                    e.currentTarget.value = props.value
                }}
                placeholder={props.placeholder}
                value={props.value}
                type={showPassword() ? 'text' : 'password'}
            />
            <div
                classList={{ 'pr-1': showPassword() }}
                class="cursor-pointer text-grey-100"
                onClick={() => setShowPassword(!showPassword())}>
                {!showPassword() ? <FaRegularEyeSlash size={18} /> : <FaRegularEye size={16} />}
            </div>
        </div>
    )
}

export default PasswordInput
