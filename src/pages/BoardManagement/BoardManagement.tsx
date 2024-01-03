import { Component, createMemo, createSignal, onCleanup, onMount } from 'solid-js'
import { SelectBoard } from '@components/Board/SelectBoard/SelectBoard'
import { DebugMode } from '@components/DebugMode/DebugMode'
import { Footer } from '@components/Footer/Footer'
import { QuestionMark } from '@components/QuestionMark/QuestionMark'

export interface IProps {
    activeBoard: string
    firmwareVersion: string
    onSubmit: (board: string) => void
    onClickConfirm: () => void
    boards: Array<{ board: string; description: string; debugMode?: boolean }>
    debugMode: string
    debugModes: string[]
    setDebugMode: (debugMode: string) => void
}

export const BoardManagement: Component<IProps> = (props) => {
    const [openDebugModeBoards, setOpenDebugModeBoards] = createSignal(false)
    const [openQuestionMark, setOpenQuestionMark] = createSignal(false)
    const [debugMode, setDebugMode] = createSignal(false)
    const [open, setOpen] = createSignal(false)

    let ref: HTMLDivElement
    let questionRef: HTMLDivElement

    onMount(() => {
        setOpen(false)
    })

    const handleClick = (event: MouseEvent) => {
        if (!ref.contains(event.target as Node)) {
            setOpen(false)
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClick)
    })
    onCleanup(() => {
        document.removeEventListener('click', handleClick)
    })

    const isBoard = createMemo(() => !props.activeBoard)

    return (
        <div class="flex flex-grow">
            <div class="flex flex-col w-full">
                <div class="flex flex-col gap-[10px] h-full justify-center items-center">
                    <div class="flex flex-col gap-[10px] justify-start">
                        <div class="flex justify-end gap-[12px]">
                            <QuestionMark
                                onClick={() => {
                                    setOpenQuestionMark(!openQuestionMark())
                                    setDebugMode(false)
                                }}
                                isOpen={openQuestionMark()}
                            />
                            <DebugMode
                                open={openDebugModeBoards()}
                                debugMode={props.debugMode}
                                debugModes={props.debugModes}
                                setDebugMode={props.setDebugMode}
                                ref={questionRef!}
                                isOpen={debugMode()}
                                onClick={() => {
                                    setDebugMode(!debugMode())
                                    setOpenDebugModeBoards(false)
                                    setOpenQuestionMark(false)
                                }}
                                onClickOpen={() => {
                                    setOpenDebugModeBoards(!openDebugModeBoards())
                                    setOpenQuestionMark(false)
                                }}
                            />
                        </div>
                        <SelectBoard
                            ref={ref!}
                            show={open()}
                            firmwareVersion={props.firmwareVersion}
                            selectedBoard={props.activeBoard}
                            boards={props.boards}
                            onSubmit={(data) => {
                                if (props.activeBoard !== data) {
                                    props.onSubmit(data)
                                }
                                setOpen(false)
                            }}
                            onClick={() => {
                                setOpen(!open())
                            }}
                        />
                    </div>
                </div>
                <Footer
                    onClickPrimary={props.onClickConfirm}
                    isPrimaryActive={isBoard()}
                    isSecondActive={false}
                    primaryLabel="Confirm"
                />
            </div>
        </div>
    )
}

export default BoardManagement
