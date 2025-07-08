import { Component, Show } from 'solid-js'
import Typography from '@components/Typography'
import { Button } from '@components/Buttons/Button'

export interface IProps {
    onClickSetup: () => void
    onClickAddExisting: () => void
    onClickDashboard: () => void
    isConfigured: boolean
}

const Welcome: Component<IProps> = (props) => {
    return (
        <div class="w-full h-full  flex flex-col items-center justify-center gap-32 relative">
            <div class="h-full flex">
                <div class="flex scale-[2.5]">
                    <div class="flex flex-col items-center justify-center scale-[0.42] gap-32 mb-[40px]">
                        <img
                            src={'images/logo.png'}
                            class="min-w-[128px] min-h-[128px] w-64 h-64"
                        />
                        <Typography text="h1" color="white">
                            Welcome To EyeTrackVR
                        </Typography>
                        <div class="flex flex-col gap-6">
                            <Button
                                disabled={false}
                                isLoadingPrimaryButton={false}
                                isActive={true}
                                type="button"
                                label="Full ETVR Setup"
                                onClick={props.onClickSetup}
                            />
                            <Button
                                disabled={false}
                                isLoadingPrimaryButton={false}
                                isActive={false}
                                type="button"
                                label="Add Existing Trackers"
                                onClick={props.onClickAddExisting}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Show when={props.isConfigured}>
                <div class="flex justify-end w-full pb-24 px-24 z-10 absolute bottom-0">
                    <Button
                        disabled={false}
                        isLoadingPrimaryButton={false}
                        isActive={true}
                        type="button"
                        label="Dashboard"
                        onClick={props.onClickDashboard}
                    />
                </div>
            </Show>
        </div>
    )
}

export default Welcome
