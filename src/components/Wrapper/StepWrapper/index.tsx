import Typography from '@components/Typography'
import { ParentComponent, Show } from 'solid-js'

export interface IProps {
    stepNumber: string
    title?: string
    description?: string
    isCompleted: boolean
    error?: string
    hideDots?: boolean
}

export const StepWrapper: ParentComponent<IProps> = (props) => {
    return (
        <div class="flex flex-col items-left">
            <div class="flex gap-12">
                <div
                    class="w-16 h-16 border-2 rounded-100 mt-auto mb-auto bottom-0"
                    classList={{
                        'border-purple-300 bg-purple-300': props.isCompleted,
                    }}
                />
                <Show
                    when={!props.error}
                    fallback={
                        <Typography color="red" text="body">
                            {props.error}
                        </Typography>
                    }>
                    <Typography color="purple" text="body">
                        Step {props.stepNumber}
                    </Typography>
                </Show>
            </div>
            <div class="flex gap-12 w-full">
                <div class="min-w-[16px] max-w-[16px] flex justify-center pb-2">
                    <div
                        class="h-full bg-gradient-to-b from-transparent via-transparent from  to-white-100 bg-[length:100%_15px] bg-repeat-y"
                        classList={{ 'w-2': !props.hideDots }}
                    />
                </div>
                <div class="flex flex-col gap-24 w-full pt-6">
                    <Show when={props.title && !props.error}>
                        <Typography color="white" text="body" class="text-left">
                            {props.title}
                        </Typography>
                    </Show>
                    <Show when={props.description}>
                        <Typography
                            color="white"
                            text="caption"
                            class="leading-[18px] text-left max-w-[700px]">
                            {props.description}
                        </Typography>
                    </Show>
                    {props.children}
                </div>
            </div>
        </div>
    )
}
