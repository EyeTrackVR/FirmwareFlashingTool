import { SelectBoard } from '@components/Board/SelectBoard'
import { Devtools } from '@components/DevTools'
import { Footer } from '@components/Footer'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { CHANNEL_TYPE, TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { type IDropdownList } from '@interfaces/ui/interface'
import { type Component } from 'solid-js'

export interface IProps {
    onClickSetChannelMode: (data: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickOpenModal: (id: string) => void
    onSubmit: (board: string) => void
    onClickConfirm: () => void
    onClickBack: () => void
    boards: IDropdownList[]
    channelOptions: IDropdownList[]
    serverStatus: CONNECTION_STATUS
    firmwareVersion: string
    activeBoard: string
    channelMode: CHANNEL_TYPE
    lockButton: boolean
    appVersion: string
}

export const ConfigureBoardWizard: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col h-full w-full px-24">
            <div class="flex h-full justify-center items-center">
                <div class="flex flex-col gap-10 justify-start">
                    <Devtools
                        appVersion={props.appVersion}
                        connectionStatus={props.serverStatus}
                        channelOptions={props.channelOptions}
                        channelMode={props.channelMode}
                        onClickHeader={props.onClickHeader}
                        onClickOpenModal={props.onClickOpenModal}
                        onClickSetChannelMode={props.onClickSetChannelMode}
                    />
                    <SelectBoard
                        firmwareVersion={props.firmwareVersion}
                        selectedBoard={props.activeBoard}
                        boards={props.boards}
                        onSubmit={props.onSubmit}
                    />
                </div>
            </div>
            <div class="pb-24">
                <Footer
                    onClickPrimaryButton={props.onClickConfirm}
                    onClickSecondaryButton={props.onClickBack}
                    isPrimaryButtonActive={props.lockButton}
                    secondaryButtonLabel="Back"
                    primaryButtonLabel="Confirm"
                />
            </div>
        </div>
    )
}

export default ConfigureBoardWizard
