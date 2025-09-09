import DefaultBoard from '@components/Board/DefaultBoard'
import Input from '@components/Inputs/Input'
import { Modal } from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import Typography from '@components/Typography'
import { TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import { beforeSelectBoardModalID, SELECT_PORT_MODAL_ID } from '@src/static'
import { BsSearch } from 'solid-icons/bs'
import { Component, createMemo, createSignal, For, Show } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickConfirmBoard: (board: string) => void
    onClickClose: () => void
    isActive: boolean
    version: string
    ports: IDropdownList[]
    activeBoard: string
}

const SelectPortModal: Component<IProps> = (props) => {
    const [search, setSearch] = createSignal('')

    const filteredData = createMemo(() => {
        return props.ports.filter((el) => el.label.toLowerCase().includes(search().toLowerCase()))
    })

    return (
        <Modal
            width="w-[350px]"
            version={props.version}
            id={SELECT_PORT_MODAL_ID}
            isActive={props.isActive}
            onClickCloseModal={() => {
                props.onClickClose()
                setSearch('')
            }}
            onClickHeader={props.onClickHeader}>
            <div class="flex flex-col gap-24">
                <ModalHeader
                    label="Select Port"
                    onClick={() => {
                        props.onClickClose()
                        setSearch('')
                    }}
                />
                <div class="flex flex-col gap-12 items-start">
                    <Typography text="caption" color="white">
                        Search for a port…
                    </Typography>
                    <Input
                        placeholder="Search port..."
                        value={search()}
                        onChange={(e) => setSearch(e)}
                    />
                </div>
                <div class="gap-12 overflow-y-scroll h-[500px] flex flex-col w-full scrollbar">
                    <Show
                        when={filteredData().length > 0}
                        fallback={
                            <div class="flex flex-row gap-12 items-center">
                                <span class="loading loading-ring loading-md" />
                                <Typography color="white" text="caption">
                                    Searching for data
                                </Typography>
                            </div>
                        }>
                        <For each={filteredData()}>
                            {(data) => (
                                <DefaultBoard
                                    {...data}
                                    isActive={data.label === props.activeBoard}
                                    onClick={() => {
                                        const el = document.getElementById(SELECT_PORT_MODAL_ID)
                                        if (el instanceof HTMLDialogElement) {
                                            el.close()
                                        }
                                        props.onClickConfirmBoard(data.label)
                                    }}
                                />
                            )}
                        </For>
                    </Show>
                </div>
            </div>
        </Modal>
    )
}

export default SelectPortModal
