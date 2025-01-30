import { type Component } from 'solid-js'
import { SelectBoard } from '@components/Board/SelectBoard'
import { Devtools } from '@components/DevTools'
import { Footer } from '@components/Footer'
import { type IDropdownList } from '@interfaces/interfaces'
import { type CHANNEL_TYPE, TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickSetChannelMode: (data: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    setDebugMode: (debugMode: string) => void
    onClickOpenModal: (id: string) => void
    onSubmit: (board: string) => void
    onClickConfirm: () => void
    boards: IDropdownList[]
    channelOptions: IDropdownList[]
    firmwareVersion: string
    debugModes: IDropdownList[]
    activeBoard: string
    channelMode: CHANNEL_TYPE
    debugMode: string
    lockButton: boolean
}

export const BoardManagement: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col h-full w-full">
            <div class="flex h-full justify-center items-center">
                <div class="flex flex-col gap-10 justify-start">
                    <Devtools
                        channelOptions={props.channelOptions}
                        channelMode={props.channelMode}
                        debugMode={props.debugMode}
                        debugModes={props.debugModes}
                        setDebugMode={props.setDebugMode}
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
            <Footer
                onClickPrimary={props.onClickConfirm}
                isPrimaryActive={props.lockButton}
                primaryLabel="Confirm"
            />
        </div>
    )
}

export default BoardManagement
