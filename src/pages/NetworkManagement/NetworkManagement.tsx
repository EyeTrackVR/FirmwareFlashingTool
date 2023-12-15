import { Component, createMemo, createSignal, onMount } from 'solid-js'
import { Footer } from '@components/Footer/Footer'
import { SelectNetwork } from '@components/SelectNetwork/SelectNetwork'

export interface IProps {
    onClickSkip: () => void
    onSubmit: (ssid: string, password: string, areEqual: boolean) => void
    ssid: string
    password: string
}

export const NetworkManagement: Component<IProps> = (props) => {
    const [ssid, setSSID] = createSignal('')
    const [password, setPassword] = createSignal('')

    const isNotActive = createMemo(() => !ssid() || !password())

    onMount(() => {
        setSSID(props.ssid)
        setPassword(props.password)
    })

    return (
        <div class="flex flex-grow">
            <div class="flex flex-col w-full">
                <div class="flex flex-col h-full justify-center items-center">
                    <SelectNetwork
                        ssid={ssid()}
                        password={password()}
                        onChangePassword={setPassword}
                        onChangeSSID={setSSID}
                    />
                </div>
                <Footer
                    onClickSecond={props.onClickSkip}
                    onClickPrimary={() => {
                        if (isNotActive()) return
                        props.onSubmit(
                            ssid(),
                            password(),
                            props.ssid === ssid() && props.password === password(),
                        )
                    }}
                    isPrimaryActive={isNotActive()}
                    isSecondActive={false}
                    primaryLabel="Confirm"
                    secondLabel="Skip wifi configuration"
                />
            </div>
        </div>
    )
}

export default NetworkManagement
