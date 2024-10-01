import { Component, Show } from 'solid-js'
import { IInputType } from '@interfaces/types'

export interface IProps {
    id: string
    label: string
    placeholder: string
    value: string
    onInput: (value: IInputType) => void
    maxWords?: string
    isError?: string
}

export const InputField: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col mb-[48px] w-full">
            <div
                class="bg-[#0D1B26] p-[12px] border border-solid rounded-[14px]"
                classList={{
                    'border-[#FB7D89]': typeof props.isError !== 'undefined',
                    'border-[#192736]': !props.isError,
                }}>
                <div class="flex flex-row justify-between w-full">
                    <Show
                        when={!props.isError}
                        fallback={
                            <label
                                for={props.id}
                                class="block text-[14px] font-medium text-[#FB7D89] mb-2 text-left tracking-[0.02em]">
                                {props.isError}
                            </label>
                        }>
                        <label
                            for={props.id}
                            class="block text-[14px] font-medium text-white mb-2 text-left tracking-[0.02em]">
                            {props.label}
                        </label>
                    </Show>
                    <Show when={props.maxWords && !props.isError}>
                        <label
                            for={props.id}
                            class="block text-[14px] font-medium text-white mb-2 text-left tracking-[0.02em]">
                            {props.value.length}/{props.maxWords}
                        </label>
                    </Show>
                </div>
                <input
                    id={props.id}
                    class="w-full p-0 bg-transparent text-white border-none focus:outline-none focus:border-0 focus:border-[#192736] focus:ring-0 focus:ring-[#192736]"
                    placeholder={props.placeholder}
                    value={props.value}
                    onInput={(e) => props.onInput(e)}
                />
            </div>
        </div>
    )
}
