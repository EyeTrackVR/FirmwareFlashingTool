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
                'border-solid border-1 border-[#817DF7]': active(),
                'border-solid border-1 border-[#192736]': !active(),
            }}
            class={
                'flex justify-center items-center p-[6px] h-[39px] bg-[#192736] w-full rounded-[6px] placeholder-white text-[12px] text-white'
            }>
            <input
                required={props.required}
                autofocus={props.autoFocus}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                class="h-full pl-[6px] pr-[6px] bg-[#192736] w-full rounded-[6px] border-solid border-0 focus:ring-0 focus:ring-[#192736] border-[#192736] placeholder-white text-[12px] text-white focus:border-0 focus:border-[#192736]"
                onInput={(e) => {
                    props.onChange(e.currentTarget.value)
                    e.currentTarget.value = props.value
                }}
                placeholder={props.placeholder}
                value={props.value}
                type={showPassword() ? 'text' : 'password'}
            />
            <div
                classList={{ 'pr-[1px]': showPassword() }}
                class={'cursor-pointer text-[#7288a1]'}
                onClick={() => setShowPassword(!showPassword())}>
                {!showPassword() ? <FaRegularEyeSlash size={18} /> : <FaRegularEye size={16} />}
            </div>
        </div>
    )
}

export default PasswordInput
