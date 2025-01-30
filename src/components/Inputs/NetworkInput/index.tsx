import Typography from '@components/Typography'
import { createSignal, type Component } from 'solid-js'

interface IProps {
    onChange: (value: string) => void
    placeholder: string
    autoFocus?: boolean
    type?: string
    id?: string
    value: string
}

const NetworkInput: Component<IProps> = (props) => {
    const [active, setActive] = createSignal<boolean>(false)

    return (
        <div
            classList={{
                'border-solid border-1 border-purple-200': active(),
                'border-solid border-1 border-black-800': !active(),
            }}
            class="flex justify-center items-center rounded-6 p-6 h-[39px] bg-black-800 w-full rounded6 placeholder-white-100 text-white-100">
            <Typography color="lightGrey" text="small">
                http://
            </Typography>
            <input
                autocomplete="off"
                autofocus={props.autoFocus}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                class="h-full pl-2 pr-2 bg-black-800 w-full border-solid border-0 focus:ring-0 focus:ring-black-800 border-black-800 placeholder-white-100 text-[12px] text-white-100 focus:border-0 focus:border-black-800"
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
            <Typography color="lightGrey" text="small">
                .local
            </Typography>
        </div>
    )
}

export default NetworkInput
