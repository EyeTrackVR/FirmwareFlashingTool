import Input from '@components/Inputs/Input'
import NetworkInput from '@components/Inputs/NetworkInput'
import PasswordInput from '@components/Inputs/PasswordInput'
import Typography from '@components/Typography'
import { shortMdnsAddress } from '@src/utils'
import { Component } from 'solid-js'

export interface IProps {
    ssid: string
    password: string
    mdns: string
    onChangeSSID: (ssid: string) => void
    onChangePassword: (password: string) => void
    onChangeMdns: (mdns: string) => void
}

export const SelectNetwork: Component<IProps> = (props) => {
    return (
        <form
            action="#"
            class="flex flex-col gap-10 w-[320px] p-24 rounded-12 border border-solid border-black-800 bg-black-900">
            <div class="flex flex-col gap-10">
                <Typography color="white" text="caption" class="text-left">
                    Tracker name
                </Typography>
                <Typography color="blue" text="small" class="text-left">
                    {`The tracker will be accessible under: http://${
                        !props.mdns ? 'openiristracker' : shortMdnsAddress(props.mdns)
                    }.local`}
                </Typography>
                <div>
                    <NetworkInput
                        id="mdns"
                        type="text"
                        onChange={props.onChangeMdns}
                        value={props.mdns}
                        placeholder="openiristracker"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-10">
                <Typography color="white" text="caption" class="text-left">
                    SSID
                </Typography>
                <div>
                    <Input
                        id="firstName"
                        autoComplete="given-name"
                        required={true}
                        autoFocus={true}
                        type="text"
                        onChange={props.onChangeSSID}
                        placeholder="Enter your wifi name"
                        value={props.ssid}
                    />
                </div>
            </div>
            <div class="flex flex-col gap-10">
                <Typography color="white" text="caption" class="text-left">
                    Password
                </Typography>
                <div>
                    <PasswordInput
                        required={true}
                        onChange={props.onChangePassword}
                        value={props.password}
                        placeholder="Enter password"
                    />
                </div>
            </div>
        </form>
    )
}
