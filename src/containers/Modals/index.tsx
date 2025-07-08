import { activeModal } from '@store/ui/selectors'
import { Match, Show, Switch } from 'solid-js'
import ApMode from './ApMode'
import BeforeFlashingRoot from './BeforeFlashing'
import BeforeSelectBoardModal from './BeforeSelectBoard'
import CloseAppModal from './CloseApp'
import EstablishConnection from './EstablishConnection'
import UpdateNetworkRoot from './UpdateNetwork'
import { MODAL_TYPE } from '@interfaces/ui/enums'

export const ModalRoot = () => {
    return (
        <Show when={activeModal().open}>
            <div class="absolute top-0 left-0">
                <Switch>
                    <Match when={activeModal().type === MODAL_TYPE.AP_MODE}>
                        <ApMode />
                    </Match>
                    <Match when={activeModal().type === MODAL_TYPE.ESTABLISH_CONNECTION}>
                        <EstablishConnection />
                    </Match>
                    <Match when={activeModal().type === MODAL_TYPE.UPDATE_NETWORK}>
                        <UpdateNetworkRoot />
                    </Match>
                    <Match when={activeModal().type === MODAL_TYPE.BEFORE_FLASHING}>
                        <BeforeFlashingRoot />
                    </Match>
                    <Match when={activeModal().type === MODAL_TYPE.BEFORE_SELECT_BOARD}>
                        <BeforeSelectBoardModal />
                    </Match>
                    <Match when={activeModal().type === MODAL_TYPE.CLOSE_APP}>
                        <CloseAppModal />
                    </Match>
                </Switch>
            </div>
        </Show>
    )
}

export default ModalRoot
