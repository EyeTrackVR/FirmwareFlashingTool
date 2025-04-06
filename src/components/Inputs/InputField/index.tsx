import Typography from '@components/Typography'
import { Component, Show } from 'solid-js'

export interface IProps {
    id: string
    label: string
    placeholder: string
    value: string
    onInput: (value: any) => void
    maxWords?: string
    isError?: string
}

export const InputField: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col w-full">
            <div
                class="bg-black-900 p-12 border border-solid rounded-14 flex flex-col gap-12"
                classList={{
                    'border-red-100': (props?.isError?.length ?? 0) > 0,
                    'border-black-800': !props.isError,
                }}>
                <div class="flex flex-row justify-between w-full text-left">
                    <Typography color="white" text="caption">
                        {props.label}
                    </Typography>
                    <Show when={props.maxWords}>
                        <Typography color="white" text="caption">
                            {props.value.length}/{props.maxWords}
                        </Typography>
                    </Show>
                </div>
                <input
                    class="h-39 p-12 w-full rounded-6 border-solid border-1 bg-black-800 border-black-800 placeholder-white-100 text-[14px] text-white-100 focus:border-black-800 focus:ring-purple-200"
                    placeholder={props.placeholder}
                    onInput={(e) => props.onInput(e)}
                    value={props.value}
                    id={props.id}
                />
            </div>
        </div>
    )
}
