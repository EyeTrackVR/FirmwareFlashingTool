import DevtoolsModal from './DevtoolsModal'
import SelectBoardModal from './SelectboardModal'
import SelectPortModal from './SelectPortModal'

export const ModalRoot = () => {
    return (
        <>
            <SelectBoardModal />
            <SelectPortModal />
            <DevtoolsModal />
        </>
    )
}

export default ModalRoot
