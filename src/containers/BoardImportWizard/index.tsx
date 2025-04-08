import BoardImportWizard from '@pages/BoardImportWizard'
import { useNavigate } from '@solidjs/router'
import { removeBoard, setBoard, updateBoard } from '@store/boards/boards'
import { boards } from '@store/boards/selectors'
import { openDocs } from '@store/terminal/actions'

const BoardImportWizardRoot = () => {
    const navigate = useNavigate()

    return (
        <BoardImportWizard
            boards={boards()}
            onClickAddBoard={(board) => {
                setBoard(board)
            }}
            onClickBack={() => {
                navigate('/')
            }}
            onClickConfirm={() => {}}
            onClickDeleteBoard={(id) => {
                removeBoard(id)
            }}
            onClickEditBoard={(board) => {
                updateBoard(board)
            }}
            onClickOpenDocs={openDocs}
        />
    )
}

export default BoardImportWizardRoot
