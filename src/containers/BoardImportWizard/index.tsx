import BoardImportWizard from '@pages/BoardImportWizard'
import { useNavigate } from '@solidjs/router'
import { removeBoard, setBoard } from '@store/boards/boards'
import { boards } from '@store/boards/selectors'
import { openDocs } from '@store/terminal/actions'

const BoardImportWizardRoot = () => {
    const navigate = useNavigate()

    return (
        <BoardImportWizard
            boards={boards()}
            onClickAddBoard={(label, address, id) => {
                setBoard({ label, address, id })
            }}
            onClickBack={() => {
                navigate('/')
            }}
            onClickConfirm={() => {}}
            onClickDeleteBoard={(id) => {
                removeBoard(id)
            }}
            onClickEditBoard={() => {}}
            onClickOpenDocs={openDocs}
        />
    )
}

export default BoardImportWizardRoot
