import BoardImportWizard from '@pages/BoardImportWizard'
import { useNavigate } from '@solidjs/router'
import { setBoards } from '@store/boards/boards'
import { boards } from '@store/boards/selectors'
import { useAppUIContext } from '@store/context/ui'
import { openDocs } from '@store/terminal/actions'

const BoardImportWizardRoot = () => {
    const { navigationStep } = useAppUIContext()
    const navigate = useNavigate()

    return (
        <BoardImportWizard
            boards={boards()}
            onClickAddBoards={(boards) => {
                setBoards(boards)
                navigate('/dashboard')
            }}
            onClickBack={() => {
                if (navigationStep() === '/flashFirmware') {
                    navigate('/flashFirmware')
                    return
                }
                navigate('/')
            }}
            onClickOpenDocs={openDocs}
        />
    )
}

export default BoardImportWizardRoot
