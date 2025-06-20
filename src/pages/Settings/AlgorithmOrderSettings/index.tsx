import Button from '@components/Buttons/Button'
import PrimaryButton from '@components/Buttons/PrimaryButton'
import { ToggleButton } from '@components/Buttons/ToggleButton'
import Camera from '@components/Camera/Camera'
import Tooltip from '@components/Tooltip'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { ALGORITHM_ORDER_SETTINGS } from '@interfaces/Settings/enums'
import { FaSolidCode } from 'solid-icons/fa'
import { Component, createMemo, Show } from 'solid-js'

export interface IProps {
    loader: boolean
    toggle: Partial<Record<ALGORITHM_ORDER_SETTINGS, boolean>>
    showButtons: boolean
    cameraFeed: string
    onToggle: (key: ALGORITHM_ORDER_SETTINGS, status: boolean) => void
    onClickReset: () => void
    onClickUpdateSettings: () => void
}

const AlgorithmOrderSettings: Component<IProps> = (props) => {
    const isValidUpdate = createMemo(() => {
        const hasDisabled = Object.values(props.toggle).every((value) => !value)
        return !hasDisabled && props.showButtons
    })

    return (
        <section class="relative w-full pr-24 pt-8 flex flex-col gap-12">
            <Show when={isValidUpdate()}>
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
                    onClick={props.onClickReset}
                    disabled={props.loader}
                />
            </div>
            <div class="flex min-[1000px]:flex-row flex-col-reverse gap-12">
                <ContextWrapper
                    icon={FaSolidCode}
                    iconColor="white"
                    label="Tracking algorithm order settings"
                    description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                    <div class="flex flex-col gap-12 items-start">
                        <Typography text="caption" color="white">
                            Lorem ipsum
                        </Typography>
                        <div class="flex flex-row gap-24 w-full">
                            <div class="flex flex-col gap-24 w-full">
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton
                                            disabled={props.loader}
                                            onToggle={() => {
                                                props.onToggle(
                                                    ALGORITHM_ORDER_SETTINGS.LEAP,
                                                    !props.toggle[ALGORITHM_ORDER_SETTINGS.LEAP],
                                                )
                                            }}
                                            isToggled={
                                                props.toggle[ALGORITHM_ORDER_SETTINGS.LEAP] ?? false
                                            }
                                        />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        LEAP
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton
                                            disabled={props.loader}
                                            onToggle={() => {
                                                props.onToggle(
                                                    ALGORITHM_ORDER_SETTINGS.BLOB,
                                                    !props.toggle[ALGORITHM_ORDER_SETTINGS.BLOB],
                                                )
                                            }}
                                            isToggled={
                                                props.toggle[ALGORITHM_ORDER_SETTINGS.BLOB] ?? false
                                            }
                                        />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        BLOB
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton
                                            onToggle={() => {
                                                props.onToggle(
                                                    ALGORITHM_ORDER_SETTINGS.HSRAC,
                                                    !props.toggle[ALGORITHM_ORDER_SETTINGS.HSRAC],
                                                )
                                            }}
                                            isToggled={
                                                props.toggle[ALGORITHM_ORDER_SETTINGS.HSRAC] ??
                                                false
                                            }
                                            disabled={props.loader}
                                        />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        HSRAC
                                    </Typography>
                                </div>
                            </div>
                            <div class="flex flex-col gap-24 w-full">
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton
                                            onToggle={() => {
                                                props.onToggle(
                                                    ALGORITHM_ORDER_SETTINGS.RANSAC,
                                                    !props.toggle[ALGORITHM_ORDER_SETTINGS.RANSAC],
                                                )
                                            }}
                                            isToggled={
                                                props.toggle[ALGORITHM_ORDER_SETTINGS.RANSAC] ??
                                                false
                                            }
                                            disabled={props.loader}
                                        />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        RANSAC
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton
                                            onToggle={() => {
                                                props.onToggle(
                                                    ALGORITHM_ORDER_SETTINGS.HSF,
                                                    !props.toggle[ALGORITHM_ORDER_SETTINGS.HSF],
                                                )
                                            }}
                                            isToggled={
                                                props.toggle[ALGORITHM_ORDER_SETTINGS.HSF] ?? false
                                            }
                                            disabled={props.loader}
                                        />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        HSF
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <Tooltip description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                                        <ToggleButton
                                            onToggle={() => {
                                                props.onToggle(
                                                    ALGORITHM_ORDER_SETTINGS.AHSF,
                                                    !props.toggle[ALGORITHM_ORDER_SETTINGS.AHSF],
                                                )
                                            }}
                                            isToggled={
                                                props.toggle[ALGORITHM_ORDER_SETTINGS.AHSF] ?? false
                                            }
                                            disabled={props.loader}
                                        />
                                    </Tooltip>
                                    <Typography color="white" text="caption" nowrap>
                                        AHSF
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </ContextWrapper>
                <div class="relative flex flex-col items-center justify-center gap-24 bg-black-900 p-24 rounded-12 border border-solid border-black-800">
                    <div class=" min-w-[240px] max-w-[240px] max-h-[240px] min-h-[240px] flex flex-col gap-24 p-24">
                        <Camera streamSource={props.cameraFeed} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AlgorithmOrderSettings
