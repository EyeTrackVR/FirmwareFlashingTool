import { type Component } from 'solid-js'
import { SelectBoard } from '@components/Board/SelectBoard'
import { Devtools } from '@components/DevTools'
import { Footer } from '@components/Footer'
import { type IDropdownList } from '@interfaces/interfaces'
import { type CHANNEL_TYPE, TITLEBAR_ACTION } from '@src/static/types/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'

export interface IProps {
    onClickSetChannelMode: (data: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    setDebugMode: (debugMode: string) => void
    onClickOpenModal: (id: string) => void
    onSubmit: (board: string) => void
    onClickConfirm: () => void
    onClickBack: () => void
    onClickDocs: () => void
    boards: IDropdownList[]
    channelOptions: IDropdownList[]
    serverStatus: CONNECTION_STATUS
    firmwareVersion: string
    debugModes: IDropdownList[]
    activeBoard: string
    channelMode: CHANNEL_TYPE
    debugMode: string
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
                        debugMode={props.debugMode}
                        debugModes={props.debugModes}
                        setDebugMode={props.setDebugMode}
                        onClickHeader={props.onClickHeader}
                        onClickOpenModal={props.onClickOpenModal}
                        onClickSetChannelMode={props.onClickSetChannelMode}
                        onClickDocs={props.onClickDocs}
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
