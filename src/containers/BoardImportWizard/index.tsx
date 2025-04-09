import BoardImportWizard from '@pages/BoardImportWizard'
import { useNavigate } from '@solidjs/router'
import { removeBoard, setBoard, updateBoard } from '@store/boards/boards'
import { boards } from '@store/boards/selectors'
import { useAppUIContext } from '@store/context/ui'
import { openDocs } from '@store/terminal/actions'

const BoardImportWizardRoot = () => {
    const { navigationStep } = useAppUIContext()
    const navigate = useNavigate()

    return (
        <BoardImportWizard
            boards={boards()}
            onClickAddBoard={(board) => {
                setBoard(board)
            }}
            onClickBack={() => {
                if (navigationStep() === '/flashFirmware') {
                    navigate('/flashFirmware')
                    return
                }
                navigate('/')
            }}
            onClickConfirm={() => {
                navigate('/dashboard')
            }}
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
