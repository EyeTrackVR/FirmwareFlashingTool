import DevtoolsModal from './DevtoolsModal'
import SelectBoardModal from './SelectboardModal'
import SelectPortModal from './SelectPortModal'
import UpdaterModal from './UpdaterModal'

export const ModalRoot = () => {
    return (
        <>
            <UpdaterModal />
            <SelectBoardModal />
            <SelectPortModal />
            <DevtoolsModal />
        </>
    )
}

export default ModalRoot
