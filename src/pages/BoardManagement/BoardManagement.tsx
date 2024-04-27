import { Component, createMemo } from 'solid-js'
import { SelectBoard } from '@components/Board/SelectBoard/SelectBoard'
import { DebugMode } from '@components/DebugMode/DebugMode'
import { Footer } from '@components/Footer/Footer'
import { QuestionMark } from '@components/QuestionMark/QuestionMark'
import { TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    activeBoard: string
    firmwareVersion: string
    setDebugMode: (debugMode: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickOpenModal: (id: string) => void
    onSubmit: (board: string) => void
    onClickConfirm: () => void
    boards: Array<{ board: string; description: string; debugMode?: boolean }>
    debugMode: string
    debugModes: string[]
}

export const BoardManagement: Component<IProps> = (props) => {
    const isBoard = createMemo(() => !props.activeBoard)

    return (
        <div class="flex flex-grow">
            <div class="flex flex-col w-full">
                <div class="flex flex-col gap-[10px] h-full justify-center items-center">
                    <div class="flex flex-col gap-[10px] justify-start">
                        <div class="flex justify-end gap-[12px]">
                            <QuestionMark
                                onClickHeader={props.onClickHeader}
                                onClickOpenModal={props.onClickOpenModal}
                            />
                            <DebugMode
                                debugMode={props.debugMode}
                                debugModes={props.debugModes}
                                setDebugMode={props.setDebugMode}
                                onClickHeader={props.onClickHeader}
                                onClickOpenModal={props.onClickOpenModal}
                            />
                        </div>
                        <SelectBoard
                            firmwareVersion={props.firmwareVersion}
                            selectedBoard={props.activeBoard}
                            boards={props.boards}
                            onSubmit={(data) => {
                                if (props.activeBoard !== data) {
                                    props.onSubmit(data)
                                }
                            }}
                        />
                    </div>
                </div>
                <Footer
                    onClickPrimary={props.onClickConfirm}
                    isPrimaryActive={isBoard()}
                    primaryLabel="Confirm"
                />
            </div>
        </div>
    )
}

export default BoardManagement
