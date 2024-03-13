import { Component } from 'solid-js'
import Input from '@components/Inputs/Input/Input'
import NetworkInput from '@components/Inputs/NetworkInput'
import PasswordInput from '@components/Inputs/PasswordInput'
import { shortMdnsAddress } from '@src/utils'

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
            class="flex flex-col gap-[10px] w-[320px] p-[24px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]">
            <div class="flex flex-col gap-[10px]">
                <div class="text-left text-[14px] text-white font-medium leading-[14px] not-italic">
                    Tracker name
                </div>
                <div class="text-left text-[12px] text-[#4F6B87] font-medium leading-[14px] not-italic break-words">
                    {`The tracker will be accessible under: http://${
                        !props.mdns ? 'openiristracker' : shortMdnsAddress(props.mdns)
                    }.local`}
                </div>
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
            <div class="flex flex-col gap-[10px]">
                <div class="text-left text-[14px] text-white font-medium leading-[14px] not-italic">
                    SSID
                </div>
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
            <div class="flex flex-col gap-[10px]">
                <div class="text-left text-[14px] text-white font-medium leading-[14px] not-italic">
                    Password
                </div>
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
