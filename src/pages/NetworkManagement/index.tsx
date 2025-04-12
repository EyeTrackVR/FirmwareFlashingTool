import { Component, createMemo, createSignal, onMount } from 'solid-js'
import { Footer } from '@components/Footer'
import { SelectNetwork } from '@components/SelectNetwork'

export interface IProps {
    onClickSkip: () => void
    onSubmit: (ssid: string, password: string, mdns: string) => void
    ssid: string
    mdns: string
    password: string
}

export const NetworkManagement: Component<IProps> = (props) => {
    const [ssid, setSSID] = createSignal('')
    const [password, setPassword] = createSignal('')
    const [mdns, setMdns] = createSignal('')

    const isActive = createMemo(() => !ssid() || !password())

    onMount(() => {
        setSSID(props.ssid)
        setPassword(props.password)
        setMdns(props.mdns)
    })

    return (
        <div class="flex flex-grow px-24">
            <div class="flex flex-col w-full">
                <div class="flex flex-col h-full justify-center items-center">
                    <SelectNetwork
                        ssid={ssid()}
                        mdns={mdns()}
                        password={password()}
                        onChangePassword={setPassword}
                        onChangeSSID={setSSID}
                        onChangeMdns={(value) => {
                            if (/[^A-Za-z\d]/.test(value)) return
                            setMdns(value.toLocaleLowerCase())
                        }}
                    />
                </div>
                <div class="pb-24">
                    <Footer
                        onClickPrimaryButton={() => {
                            if (isActive()) return
                            props.onSubmit(ssid(), password(), mdns())
                        }}
                        onClickSecondaryButton={props.onClickSkip}
                        isPrimaryButtonActive={!isActive()}
                        secondaryButtonLabel="Back"
                        primaryButtonLabel="Confirm"
                    />
                </div>
            </div>
        </div>
    )
}

export default NetworkManagement
