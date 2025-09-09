import BeforeFlashingModal from './BeforeFlashingModal'
import SelectBoardModal from './SelectboardModal'
import SelectPortModal from './SelectPortModal'

export const ModalRoot = () => {
    return (
        <>
            <SelectBoardModal />
            <SelectPortModal />
            <BeforeFlashingModal />
        </>
    )
}

export default ModalRoot
