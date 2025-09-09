import BeforeFlashingModal from './BeforeFlashingModal'
import DevtoolsModal from './DevtoolsModal'
import SelectBoardModal from './SelectboardModal'
import SelectPortModal from './SelectPortModal'

export const ModalRoot = () => {
    return (
        <>
            <SelectBoardModal />
            <SelectPortModal />
            <BeforeFlashingModal />
            <DevtoolsModal />
        </>
    )
}

export default ModalRoot
