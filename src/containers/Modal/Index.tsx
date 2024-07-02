import { Show } from 'solid-js'
import ApModeModal from './ApModeModal'
import { MODAL_TYPE } from '@interfaces/enums'
import { useAppUIContext } from '@store/context/ui'

export const ModalRoot = () => {
    const { modal } = useAppUIContext()

    return (
        <Show when={modal().open}>
            <div class="absolute top-0 left-0">
                <Show when={modal().type === MODAL_TYPE.AP_MODE}>
                    <ApModeModal />
                </Show>
            </div>
        </Show>
    )
}

export default ModalRoot
