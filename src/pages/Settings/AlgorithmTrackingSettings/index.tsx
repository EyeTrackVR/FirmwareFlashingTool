import AdvancedDropdown from '@components/AdvancedDropdown'
import Button from '@components/Buttons/Button'
import PrimaryButton from '@components/Buttons/PrimaryButton'
import { ToggleButton } from '@components/Buttons/ToggleButton'
import RangeSlider from '@components/Inputs/RangeSlider'
import Tooltip from '@components/Tooltip'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { TRACKING_ALGORITHM_SETTINGS_ENUM } from '@interfaces/Settings/enums'
import { VsSettings } from 'solid-icons/vs'
import { Component, Show } from 'solid-js'

export interface IProps {
    updateAllowed?: boolean
    inputChange: number
    toggle: Partial<Record<TRACKING_ALGORITHM_SETTINGS_ENUM, boolean>>
    loader: boolean
    onClickReset: () => void
    onClickUpdateSettings: () => void
    onToggle: (key: TRACKING_ALGORITHM_SETTINGS_ENUM, status: boolean) => void
    onInputChange: (value: number) => void
}

const AlgorithmTrackingSettings: Component<IProps> = (props) => {
    return (
        <section class="relative w-full pr-24 pt-8 flex flex-col gap-12">
            <Show when={props.updateAllowed}>
                <div class="absolute bottom-[20px] left-[50%] transform -translate-x-1/2 flex flex-row gap-24 bg-black-900 py-12 px-24 rounded-12 border border-solid border-black-800">
                    <Button
                        label="Cancel"
                        isDangerous
                        onClick={props.onClickReset}
                        disabled={props.loader}
                    />
                    <PrimaryButton
                        disabled={props.loader}
                        label="Update settings"
                        isActive
                        onClick={props.onClickUpdateSettings}
                    />
                </div>
            </Show>
            <div class="w-full flex flex-row justify-end ">
                <Button
                    label="Reset settings to default"
                    isDangerous
                    disabled={props.loader}
                    onClick={props.onClickReset}
                />
            </div>
            <AdvancedDropdown>
                <ContextWrapper
                    icon={VsSettings}
                    iconColor="white"
                    label="Advanced tracking alghoritm settings"
                    description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                    <div class="flex flex-col gap-24">
                        <div class="flex flex-row min-[850px]:gap-24 gap-12">
                            <div class="flex flex-row items-center gap-6">
                                <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                    <ToggleButton
                                        disabled={props.loader}
                                        onToggle={() => {
                                            props.onToggle(
                                                TRACKING_ALGORITHM_SETTINGS_ENUM.SKIP_AUTO_RADIUS,
                                                !props.toggle[
                                                    TRACKING_ALGORITHM_SETTINGS_ENUM
                                                        .SKIP_AUTO_RADIUS
                                                ],
                                            )
                                        }}
                                        isToggled={
                                            props.toggle[
                                                TRACKING_ALGORITHM_SETTINGS_ENUM.SKIP_AUTO_RADIUS
                                            ] ?? false
                                        }
                                    />
                                </Tooltip>
                                <Typography color="white" text="caption" nowrap>
                                    Skip auto radius
                                </Typography>
                            </div>
                            <div class="flex flex-row items-center gap-6">
                                <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                    <ToggleButton
                                        disabled={props.loader}
                                        onToggle={() => {
                                            props.onToggle(
                                                TRACKING_ALGORITHM_SETTINGS_ENUM.SKIP_BLINK_DETECTION,
                                                !props.toggle[
                                                    TRACKING_ALGORITHM_SETTINGS_ENUM
                                                        .SKIP_BLINK_DETECTION
                                                ],
                                            )
                                        }}
                                        isToggled={
                                            props.toggle[
                                                TRACKING_ALGORITHM_SETTINGS_ENUM
                                                    .SKIP_BLINK_DETECTION
                                            ] ?? false
                                        }
                                    />
                                </Tooltip>
                                <Typography color="white" text="caption" nowrap>
                                    Skip Blink detection
                                </Typography>
                            </div>
                        </div>
                        <div class="flex flex-col items-start gap-6">
                            <Typography text="caption" color="white">
                                Blink stat frames
                            </Typography>
                            <RangeSlider
                                disabled={props.loader}
                                max={180}
                                min={1}
                                value={props.inputChange}
                                onChange={props.onInputChange}
                            />
                        </div>
                    </div>
                </ContextWrapper>
            </AdvancedDropdown>
        </section>
    )
}

export default AlgorithmTrackingSettings
