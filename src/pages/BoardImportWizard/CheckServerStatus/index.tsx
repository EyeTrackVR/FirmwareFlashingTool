import PrimaryButton from '@components/Buttons/PrimaryButton'
import Typography from '@components/Typography'
import { Component, Show } from 'solid-js'

export interface IProps {
    connectionFailed: boolean
    onClick: () => void
}

const CheckServerStatus: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col gap-24 items-start w-full min-h-[500px] h-full">
            <div class="w-full h-full flex justify-center items-center">
                <div class="flex flex-row items-center justify-center gap gap-24 h-full">
                    <div class="flex flex-col items-center gap-24 bg-black-900 p-48 rounded-12 border border-solid border-black-800 min-[1001px]:max-w-[600px] w-full">
                        <span class="loading loading-dots w-[48px] h-[48px]"></span>
                        <Show
                            when={props.connectionFailed}
                            fallback={
                                <div class="flex flex-col gap-12">
                                    <Typography color="white" text="body">
                                        Establishing connection
                                    </Typography>
                                    <Typography color="white" text="caption">
                                        Estimated time ~ 10s
                                    </Typography>
                                </div>
                            }>
                            <Typography color="red" text="body">
                                Failed to establish connection
                            </Typography>
                        </Show>
                        <Show when={props.connectionFailed}>
                            <PrimaryButton
                                label="Try again"
                                type="button"
                                isActive
                                onClick={props.onClick}
                            />
                        </Show>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckServerStatus
