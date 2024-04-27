import { Component, createMemo, createSignal, onMount } from 'solid-js'
import { Footer } from '@components/Footer/Footer'
import { SelectNetwork } from '@components/SelectNetwork/SelectNetwork'

export interface IProps {
    onClickSkip: () => void
    onSubmit: (ssid: string, password: string, mdns: string) => void
    isLoading: boolean
    ssid: string
    mdns: string
    password: string
}

export const NetworkManagement: Component<IProps> = (props) => {
    const [ssid, setSSID] = createSignal('')
    const [password, setPassword] = createSignal('')
    const [mdns, setMdns] = createSignal('')

    const isNotActive = createMemo(() => !ssid() || !password())

    onMount(() => {
        setSSID(props.ssid)
        setPassword(props.password)
        setMdns(props.mdns)
    })

    return (
        <div class="flex flex-grow">
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
                <Footer
                    isLoadingPrimaryButton={props.isLoading}
                    onClickSecond={props.onClickSkip}
                    onClickPrimary={() => {
                        if (isNotActive()) return
                        props.onSubmit(ssid(), password(), mdns())
                    }}
                    isPrimaryActive={isNotActive()}
                    isSecondActive={false}
                    primaryLabel="Confirm"
                    secondLabel="Select board"
                />
            </div>
        </div>
    )
}

export default NetworkManagement
