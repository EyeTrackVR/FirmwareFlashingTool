import { MODAL_TYPE } from '@interfaces/enums'
import { createEffect, Match, Show, Switch } from 'solid-js'
import ApMode from './ApMode'
import BeforeFlashingRoot from './BeforeFlashing'
import BeforeSelectBoardModal from './BeforeSelectBoard'
import UpdateNetworkRoot from './UpdateNetwork'
import { activeModal } from '@store/ui/selectors'
import EstablishConnection from './EstablishConnection'

export const ModalRoot = () => {
    createEffect(() => {
        console.log(activeModal())
    })

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
                </Switch>
            </div>
        </Show>
    )
}

export default ModalRoot
