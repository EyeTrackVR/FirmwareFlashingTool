import { Component } from 'solid-js'
import Input from '@components/input'

export interface IProps {
    ssid: string
    password: string
    onChangeSSID: (ssid: string) => void
    onChangePassword: (password: string) => void
}

export const SelectNetwork: Component<IProps> = (props) => {
    return (
        <form
            action="#"
            class="flex flex-col gap-[10px] w-[285px] p-[24px] rounded-[12px] border border-solid border-[#192736] bg-[#0D1B26]">
            <div class="flex flex-col gap-[10px]">
                <div class="text-left text-[14px] text-white font-[500] leading-[14px] not-italic">
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
                <div class="text-left text-[14px] text-white font-[500] leading-[14px] not-italic">
                    Password
                </div>
                <div>
                    <Input
                        id="password"
                        autoComplete="current-password"
                        required={true}
                        type="password"
                        onChange={props.onChangePassword}
                        value={props.password}
                        placeholder="Enter password"
                    />
                </div>
            </div>
        </form>
    )
}
