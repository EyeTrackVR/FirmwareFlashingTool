import type { Component } from 'solid-js'

interface Props {
    onChange: (value: string) => void
    placeholder: string
    header: string
    type?: string
    id?: string
    required?: boolean
}

const Input: Component<Props> = (props) => {
    return (
        <div class="flex grow rounded-xl flex-col pl-3 pr-3 pb-3 pt-3 bg-[#333742] text-white">
            <div>
                <div class="flex justify-between pb-3">
                    <div>
                        <div>
                            <p class="font-[700] text-lg">{props.header}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="flex justify-between pb-3">
                    <input
                        class="text-lg w-full text-md bg-[#20202D] rounded-xl pt-3 pb-3 pl-3 pr-3 font-[700] "
                        onChange={(e) => props.onChange((e.target as HTMLInputElement).value)}
                        placeholder={props.placeholder}
                        type={props.type}
                        name={props.id}
                        id={props.id}
                        required={props.required}
                    />
                </div>
            </div>
        </div>
    )
}

export default Input
