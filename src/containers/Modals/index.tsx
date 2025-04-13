import { MODAL_TYPE } from '@interfaces/enums'
import { Match, Show, Switch } from 'solid-js'
import ApModeContainer from './ApModeModalContainer'
import BeforeFlashingModal from './BeforeFlashingContainer'
import BeforeSelectBoardModal from './BeforeSelectBoardContainer'
import WifiModal from './WifiModalcontainer'
import { openModal } from '@store/ui/selectors'

export const ModalRoot = () => {
    return (
        <Show when={openModal().open}>
            <div class="absolute top-0 left-0">
                <Switch>
                    <Match when={openModal().type === MODAL_TYPE.AP_MODE}>
                        <ApModeContainer />
                    </Match>
                    <Match when={openModal().type === MODAL_TYPE.UPDATE_NETWORK}>
                        <WifiModal />
                    </Match>
                    <Match when={openModal().type === MODAL_TYPE.BEFORE_FLASHING}>
                        <BeforeFlashingModal />
                    </Match>
                    <Match when={openModal().type === MODAL_TYPE.BEFORE_SELECT_BOARD}>
                        <BeforeSelectBoardModal />
                    </Match>
                </Switch>
            </div>
        </Show>
    )
}

export default ModalRoot
