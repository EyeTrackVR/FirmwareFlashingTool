import Button from '@components/Buttons/Button'
import DefaultButton from '@components/Buttons/DefaultButton'
import NetworkBars from '@components/NetworkBars'
import Typography from '@components/Typography'
import { INetwork } from '@src/esp/interfaces/interfaces'
import { FaSolidWifi } from 'solid-icons/fa'
import { IoChevronBackSharp } from 'solid-icons/io'
import { Component, For, Show } from 'solid-js'

export interface IProps {
    onClickManualSetup: () => void
    onClickNetwork: (network: INetwork) => void
    onClickBack: () => void
    data: INetwork[]
}

const NetworkCard: Component<IProps> = (props) => {
    return (
        <div class="bg-black-900 flex py-12 px-0 rounded-12 flex-col items-center justify-between h-[480px] max-w-[720px] w-full">
            <div class="flex flex-row w-full justify-between px-12">
                <DefaultButton
                    class="opacity-1 hover:bg-black-800 rounded-full flex items-center justify-center p-6 duration-300 transition-colors"
                    onClick={() => {
                        props.onClickBack()
                    }}>
                    <IoChevronBackSharp class="w-[18px] h-[18px] text-lightBlue-300" />
                </DefaultButton>
            </div>
            <div class="w-full flex-1 flex flex-col items-center justify-center gap-24 overflow-hidden pb-12">
                <div class="flex flex-col items-center gap-24">
                    <div class="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-black-800">
                        <FaSolidWifi class="w-[52px] h-[52px] text-lightBlue-300" />
                    </div>
                    <div class="flex flex-row gap-12">
                        <Typography color="white" text="h1">
                            Select Network
                        </Typography>
                    </div>
                </div>
                <div class="flex-1 gap-8 flex flex-col w-full overflow-hidden">
                    <div class="grid  grid-cols-[1fr_50px_100px_1fr_140px] gap-4 w-full px-[24px]">
                        <Typography color="white" text="caption" class="text-left">
                            SSID
                        </Typography>
                        <Typography color="white" text="caption">
                            Channel
                        </Typography>
                        <Typography color="white" text="caption">
                            Signal
                        </Typography>
                        <Typography color="white" text="caption" class="text-right">
                            Security
                        </Typography>
                        <Typography color="white" text="caption" class="text-right">
                            Mac address
                        </Typography>
                    </div>
                    <div class="w-full flex-1 overflow-y-auto gap-4 flex flex-col scrollbar px-12">
                        <Show
                            when={props.data.length > 0}
                            fallback={
                                <div class="flex flex-row gap-12 items-start pt-24 w-full h-full justify-center">
                                    <Typography color="purple" text="caption">
                                        We were unable to find any available networks.
                                    </Typography>
                                </div>
                            }>
                            <For each={props.data}>
                                {(el) => (
                                    <div
                                        class="grid grid-cols-[1fr_50px_100px_1fr_140px]  px-12 py-12 gap-4 rounded-8 w-full mt-2 bg-black-800 duration-150 transition-colors hover:bg-purple-200 cursor-pointer"
                                        onClick={() => {
                                            props.onClickNetwork(el)
                                        }}>
                                        <Typography
                                            color="white"
                                            text="caption"
                                            class="text-left"
                                            nowrap
                                            ellipsis>
                                            {!el.ssid ? 'Hidden' : el.ssid}
                                        </Typography>
                                        <Typography color="white" text="caption" ellipsis>
                                            {el.channel}
                                        </Typography>
                                        <div class="flex items-center w-full justify-center">
                                            <NetworkBars signalBar={el.signalBar} />
                                        </div>
                                        <Typography
                                            color="white"
                                            text="caption"
                                            class="text-right"
                                            ellipsis
                                            nowrap>
                                            {el.auth_mode}
                                        </Typography>
                                        <Typography
                                            color="white"
                                            text="caption"
                                            class="text-right"
                                            nowrap>
                                            {el.mac_address}
                                        </Typography>
                                    </div>
                                )}
                            </For>
                        </Show>
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-12 w-full items-center justify-end px-12">
                <div>
                    <Button
                        label="Manual setup"
                        onClick={() => {
                            props.onClickManualSetup()
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default NetworkCard
