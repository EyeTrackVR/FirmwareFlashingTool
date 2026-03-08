import OptionButton from '@components/Buttons/OptionButton'
import Input from '@components/Inputs/Input'
import { Modal } from '@components/Modal/Modal'
import ModalHeader from '@components/Modal/ModalHeader'
import Typography from '@components/Typography'
import { type IDropdownList } from '@interfaces/firmware/interfaces'
import { TITLEBAR_ACTION } from '@interfaces/ui/enums'
import { SELECT_PORT_MODAL_ID } from '@static/index'
import { Component, createMemo, createSignal, For, Show } from 'solid-js'

export interface IProps {
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickConfirmPort: (board: string) => void
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
                                <OptionButton
                                    {...data}
                                    isActive={data.label === props.activeBoard}
                                    onClick={() => {
                                        const el = document.getElementById(SELECT_PORT_MODAL_ID)
                                        if (el instanceof HTMLDialogElement) {
                                            el.close()
                                        }
                                        props.onClickConfirmPort(data.label)
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
