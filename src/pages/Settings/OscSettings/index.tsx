import AdvancedDropdown from '@components/AdvancedDropdown'
import Button from '@components/Buttons/Button'
import PrimaryButton from '@components/Buttons/PrimaryButton'
import { ToggleButton } from '@components/Buttons/ToggleButton'
import Input from '@components/Inputs/Input'
import Typography from '@components/Typography'
import ContextWrapper from '@components/Wrapper/ContextWrapper'
import { OSC_SETTINGS_ENUM } from '@interfaces/Settings/enums'
import { validateAddress, validatePort } from '@src/utils'
import { VsSettings } from 'solid-icons/vs'
import { Component, createMemo, Show } from 'solid-js'

export interface IProps {
    toggle: Partial<Record<OSC_SETTINGS_ENUM, boolean>>
    inputChange: Partial<Record<OSC_SETTINGS_ENUM, string>>
    showButtons: boolean
    loader?: boolean
    onInputChange: (key: OSC_SETTINGS_ENUM, value: string) => void
    onToggle: (key: OSC_SETTINGS_ENUM, status: boolean) => void
    onClickReset: () => void
    onClickUpdateSettings: () => void
}

const OscSettings: Component<IProps> = (props) => {
    const isValidAddress = createMemo(() => {
        const address = props.inputChange[OSC_SETTINGS_ENUM.ADDRESS]
        if (!address) return false
        return validateAddress(address)
    })

    const isValidSendingPort = createMemo(() => {
        const port = props.inputChange[OSC_SETTINGS_ENUM.SENDING_PORT]
        if (!port) return false
        return validatePort(+port)
    })

    const isValidReceiverPort = createMemo(() => {
        const port = props.inputChange[OSC_SETTINGS_ENUM.RECEIVER_PORT]
        if (!port) return false
        return validatePort(+port)
    })

    const hasErrors = createMemo(
        () => !isValidAddress() || !isValidSendingPort() || !isValidReceiverPort(),
    )

    const isValidUpdate = createMemo(() => {
        return !hasErrors() && props.showButtons
    })

    return (
        <section class="relative w-full  pt-8 pb-12 flex flex-col gap-12">
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
            <div class="w-full flex flex-row justify-end pr-24">
                <Button
                    disabled={props.loader}
                    label="Reset settings to default"
                    isDangerous
                    onClick={props.onClickReset}
                />
            </div>
            <div class="flex flex-col gap-12 overflow-y-auto scrollbar pr-24 h-full">
                <ContextWrapper
                    icon={VsSettings}
                    iconColor="white"
                    label="OSC Settings"
                    description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                    <div class="flex flex-col gap-24">
                        <div class="flex flex-col gap-12 items-start">
                            <Typography text="caption" color="white">
                                Lorem ipsum
                            </Typography>
                            <div class="flex flex-row gap-24">
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton
                                        disabled={props.loader}
                                        onToggle={() => {
                                            props.onToggle(
                                                OSC_SETTINGS_ENUM.MIRROR_EYES,
                                                !props.toggle[OSC_SETTINGS_ENUM.MIRROR_EYES],
                                            )
                                        }}
                                        isToggled={
                                            props.toggle[OSC_SETTINGS_ENUM.MIRROR_EYES] ?? false
                                        }
                                    />
                                    <Typography color="white" text="caption" nowrap>
                                        Mirror eyes
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton
                                        disabled={props.loader}
                                        onToggle={() => {
                                            props.onToggle(
                                                OSC_SETTINGS_ENUM.SYNC_BLINK,
                                                !props.toggle[OSC_SETTINGS_ENUM.SYNC_BLINK],
                                            )
                                        }}
                                        isToggled={
                                            props.toggle[OSC_SETTINGS_ENUM.SYNC_BLINK] ?? false
                                        }
                                    />
                                    <Typography color="white" text="caption" nowrap>
                                        sync blink
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-12 items-start">
                            <Typography text="caption" color="white">
                                Lorem ipsum
                            </Typography>
                            <div class="flex flex-row gap-24">
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton
                                        disabled={props.loader}
                                        onToggle={() => {
                                            props.onToggle(
                                                OSC_SETTINGS_ENUM.ENABLE_SENDING,
                                                !props.toggle[OSC_SETTINGS_ENUM.ENABLE_SENDING],
                                            )
                                        }}
                                        isToggled={
                                            props.toggle[OSC_SETTINGS_ENUM.ENABLE_SENDING] ?? false
                                        }
                                    />
                                    <Typography color="white" text="caption" nowrap>
                                        Enable sending
                                    </Typography>
                                </div>
                                <div class="flex flex-row items-center gap-6">
                                    <ToggleButton
                                        disabled={props.loader}
                                        onToggle={() => {
                                            props.onToggle(
                                                OSC_SETTINGS_ENUM.ENABLE_RECEIVING,
                                                !props.toggle[OSC_SETTINGS_ENUM.ENABLE_RECEIVING],
                                            )
                                        }}
                                        isToggled={
                                            props.toggle[OSC_SETTINGS_ENUM.ENABLE_RECEIVING] ??
                                            false
                                        }
                                    />
                                    <Typography color="white" text="caption" nowrap>
                                        Enable receiving
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-12 items-start">
                            <Typography text="caption" color="white">
                                Lorem ipsum
                            </Typography>
                            <div class="flex flex-row items-center gap-6">
                                <ToggleButton
                                    disabled={props.loader}
                                    onToggle={() => {
                                        props.onToggle(
                                            OSC_SETTINGS_ENUM.VRCHAT_NATIVE_TRACKING,
                                            !props.toggle[OSC_SETTINGS_ENUM.VRCHAT_NATIVE_TRACKING],
                                        )
                                    }}
                                    isToggled={
                                        props.toggle[OSC_SETTINGS_ENUM.VRCHAT_NATIVE_TRACKING] ??
                                        false
                                    }
                                />
                                <Typography color="white" text="caption" nowrap>
                                    vrchat native tracking
                                </Typography>
                            </div>
                        </div>
                    </div>
                </ContextWrapper>
                <div>
                    <AdvancedDropdown class={props.showButtons ? 'pb-[90px]' : 'pb-[12px]'}>
                        <ContextWrapper
                            icon={VsSettings}
                            iconColor="white"
                            label="Address and ports"
                            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                            <div class="flex flex-col gap-24 pb-[48px]">
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Network address
                                    </Typography>
                                    <Input
                                        disabled={props.loader}
                                        isError={!isValidAddress()}
                                        onChange={(value) => {
                                            props.onInputChange(OSC_SETTINGS_ENUM.ADDRESS, value)
                                        }}
                                        placeholder="127.0.0.1"
                                        value={props.inputChange[OSC_SETTINGS_ENUM.ADDRESS] ?? ''}
                                    />
                                </div>
                                <div class="flex flex-row items-center gap-6 w-full">
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Sending port
                                        </Typography>
                                        <Input
                                            isError={!isValidSendingPort()}
                                            disabled={props.loader}
                                            onChange={(value) => {
                                                props.onInputChange(
                                                    OSC_SETTINGS_ENUM.SENDING_PORT,
                                                    value,
                                                )
                                            }}
                                            placeholder="9000"
                                            value={
                                                props.inputChange[OSC_SETTINGS_ENUM.SENDING_PORT] ??
                                                ''
                                            }
                                        />
                                    </div>
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Receiver port
                                        </Typography>
                                        <Input
                                            isError={!isValidReceiverPort()}
                                            disabled={props.loader}
                                            onChange={(value) => {
                                                props.onInputChange(
                                                    OSC_SETTINGS_ENUM.RECEIVER_PORT,
                                                    value,
                                                )
                                            }}
                                            placeholder="9001"
                                            value={
                                                props.inputChange[
                                                    OSC_SETTINGS_ENUM.RECEIVER_PORT
                                                ] ?? ''
                                            }
                                        />
                                    </div>
                                </div>
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Eyes Y
                                    </Typography>
                                    <Input
                                        disabled={props.loader}
                                        onChange={(value) => {
                                            props.onInputChange(OSC_SETTINGS_ENUM.EYES_Y, value)
                                        }}
                                        placeholder="/avatar/parameters/EyesY"
                                        value={props.inputChange[OSC_SETTINGS_ENUM.EYES_Y] ?? ''}
                                    />
                                </div>
                            </div>
                        </ContextWrapper>
                        <ContextWrapper
                            icon={VsSettings}
                            iconColor="white"
                            label="VRCFT v1 endpoints"
                            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.">
                            <div class="flex flex-col gap-24">
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Recalibrate
                                    </Typography>
                                    <Input
                                        disabled={props.loader}
                                        onChange={(value) => {
                                            props.onInputChange(
                                                OSC_SETTINGS_ENUM.RECALIBRATE,
                                                value,
                                            )
                                        }}
                                        placeholder="/avatar/parameters/etvr_recalibrate"
                                        value={
                                            props.inputChange[OSC_SETTINGS_ENUM.RECALIBRATE] ?? ''
                                        }
                                    />
                                </div>
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Sync blink
                                    </Typography>
                                    <Input
                                        disabled={props.loader}
                                        onChange={(value) => {
                                            props.onInputChange(OSC_SETTINGS_ENUM.SYNC_BLINK, value)
                                        }}
                                        placeholder="/avatar/parameters/etvr_sync_blink"
                                        value={
                                            props.inputChange[OSC_SETTINGS_ENUM.SYNC_BLINK] ?? ''
                                        }
                                    />
                                </div>
                                <div class="flex flex-col items-start gap-6">
                                    <Typography text="caption" color="white">
                                        Recenter
                                    </Typography>
                                    <Input
                                        disabled={props.loader}
                                        onChange={(value) => {
                                            props.onInputChange(OSC_SETTINGS_ENUM.RECENTER, value)
                                        }}
                                        placeholder="/avatar/parameters/etvr_recenter"
                                        value={props.inputChange[OSC_SETTINGS_ENUM.RECENTER] ?? ''}
                                    />
                                </div>
                                <div class="flex flex-row items-center gap-6 w-full">
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Left eye X
                                        </Typography>
                                        <Input
                                            disabled={props.loader}
                                            onChange={(value) => {
                                                props.onInputChange(
                                                    OSC_SETTINGS_ENUM.LEFT_EYE_X,
                                                    value,
                                                )
                                            }}
                                            placeholder="/avatar/parameters/LeftEyeX"
                                            value={
                                                props.inputChange[OSC_SETTINGS_ENUM.LEFT_EYE_X] ??
                                                ''
                                            }
                                        />
                                    </div>
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Right eye X
                                        </Typography>
                                        <Input
                                            disabled={props.loader}
                                            onChange={(value) => {
                                                props.onInputChange(
                                                    OSC_SETTINGS_ENUM.RIGHT_EYE_X,
                                                    value,
                                                )
                                            }}
                                            placeholder="/avatar/parameters/RightEyeX"
                                            value={
                                                props.inputChange[OSC_SETTINGS_ENUM.RIGHT_EYE_X] ??
                                                ''
                                            }
                                        />
                                    </div>
                                </div>
                                <div class="flex flex-row items-center gap-6 w-full">
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Left eye blink
                                        </Typography>
                                        <Input
                                            disabled={props.loader}
                                            onChange={(value) => {
                                                props.onInputChange(
                                                    OSC_SETTINGS_ENUM.LEFT_EYE_BLINK,
                                                    value,
                                                )
                                            }}
                                            placeholder="/avatar/parameters/LeftEyeLidExpandedSqueeze"
                                            value={
                                                props.inputChange[
                                                    OSC_SETTINGS_ENUM.LEFT_EYE_BLINK
                                                ] ?? ''
                                            }
                                        />
                                    </div>
                                    <div class="flex flex-col items-start gap-6 w-full">
                                        <Typography text="caption" color="white">
                                            Right eye blink
                                        </Typography>
                                        <Input
                                            disabled={props.loader}
                                            onChange={(value) => {
                                                props.onInputChange(
                                                    OSC_SETTINGS_ENUM.RIGHT_EYE_BLINK,
                                                    value,
                                                )
                                            }}
                                            placeholder="/avatar/parameters/RightEyeLidExpandedSqueeze"
                                            value={
                                                props.inputChange[
                                                    OSC_SETTINGS_ENUM.RIGHT_EYE_BLINK
                                                ] ?? ''
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </ContextWrapper>
                    </AdvancedDropdown>
                </div>
            </div>
        </section>
    )
}

export default OscSettings
