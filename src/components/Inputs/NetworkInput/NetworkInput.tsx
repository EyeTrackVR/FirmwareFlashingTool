import { clsx } from 'clsx'
import { createMemo, createSignal, type Component } from 'solid-js'

interface IProps {
    onChange: (value: string) => void
    placeholder: string
    type?: string
    id?: string
    value: string
    autoFocus?: boolean
}

const NetworkInput: Component<IProps> = (props) => {
    const [active, setActive] = createSignal<boolean>(false)

    const border = createMemo(() => {
        return active()
            ? 'border-solid border-1 border-[#817DF7]'
            : 'border-solid border-1 border-[#192736]'
    })

    return (
        <div
            class={clsx(
                'flex justify-center items-center p-[6px] h-[39px] bg-[#192736] w-full rounded-[6px] placeholder-white text-[12px] text-white',
                border(),
            )}>
            <div>
                <p class="select-none text-left text-[12px] leading-[14px] not-italic text-[#7288a1] font-medium">
                    http://
                </p>
            </div>
            <input
                autocomplete="off"
                autofocus={props.autoFocus}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                class={
                    'h-full pl-[2px] pr-[2px] bg-[#192736] w-full rounded-[6px] border-solid border-0 focus:ring-0 focus:ring-[#192736] border-[#192736] placeholder-white text-[12px] text-white focus:border-0 focus:border-[#192736]'
                }
                onInput={(e) => {
                    props.onChange(e.currentTarget.value)
                    e.currentTarget.value = props.value
                }}
                placeholder={props.placeholder}
                type={props.type}
                name={props.id}
                value={props.value}
                id={props.id}
            />
            <div>
                <p class="select-none text-left text-[12px] leading-[14px] not-italic text-[#7288a1] font-medium">
                    .local
                </p>
            </div>
        </div>
    )
}

export default NetworkInput
