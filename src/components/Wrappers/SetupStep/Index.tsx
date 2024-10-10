import { ParentComponent, Show } from 'solid-js'

export interface IProps {
    stepNumber: string
    title?: string
    description?: string
    isCompleted: boolean
    redTitle?: string
}

export const SetupStep: ParentComponent<IProps> = (props) => {
    return (
        <div class="flex flex-col items-left">
            <div class="flex gap-[12px]">
                <div
                    class="w-[16px] h-[16px] border-2 rounded-full mt-auto mb-auto bottom-0"
                    classList={{
                        'border-[#9092FF] bg-[#9092FF]': props.isCompleted,
                        'border-white bg-[#00101a]': !props.isCompleted,
                    }}
                />
                <Show
                    when={!props.redTitle}
                    fallback={
                        <p class="not-italic font-medium text-[#FB7D89] text-[16px] text-start select-none tracking-[0.02em]">
                            {props.redTitle}
                        </p>
                    }>
                    <p class="not-italic font-medium text-[#9092FF] text-[16px] text-start select-none tracking-[0.02em]">
                        Step {props.stepNumber}
                    </p>
                </Show>
            </div>
            <div class="flex gap-[12px] w-full">
                <div class="w-[16px] flex justify-center">
                    <div class="h-full w-0.5 bg-gradient-to-b from-transparent via-transparent to-white bg-[length:100%_10px] bg-repeat-y" />
                </div>
                <div class="flex flex-col gap-[24px] w-full">
                    <Show when={props.title && !props.redTitle}>
                        <div>
                            <p class="not-italic font-medium text-[16px] text-start select-none mt-[6px] tracking-[0.02em] text-white">
                                {props.title}
                            </p>
                        </div>
                    </Show>
                    <Show when={props.description}>
                        <div>
                            <p class="not-italic text-white text-[14px] text-start select-none max-w-[700px] tracking-[0.02em]">
                                {props.description}
                            </p>
                        </div>
                    </Show>
                    {props.children}
                </div>
            </div>
        </div>
    )
}
