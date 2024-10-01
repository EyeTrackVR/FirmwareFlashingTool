import { useNavigate } from '@solidjs/router'
import { createMemo } from 'solid-js'
import { CONNECTION_STATUS, NAVIGATION } from '@interfaces/enums'
import WizardConfigurator from '@pages/WizardConfigurator/Index'
import { BOARD_HARDWARE_TYPE } from '@src/static'
import { setBoard, setDeleteBoard, setUpdateBoard } from '@store/appContext/appContext'
import { boards } from '@store/appContext/selectors'
import { openDocs } from '@store/terminal/actions'
import { useAppUIContext } from '@store/ui/ui'

const SetupWizard = () => {
    const { navigationStep } = useAppUIContext()

    const navigate = useNavigate()

    const hardwareType = createMemo(() => {
        const types = boards().map((data) => data.hardwareType)
        return BOARD_HARDWARE_TYPE.filter((data) => !types.includes(data))
    })

    return (
        <WizardConfigurator
            boards={boards()}
            onClickOpenDocs={openDocs}
            onClickConfirm={() => {
                navigate(NAVIGATION.HOME)
            }}
            onClickBack={() => {
                if (navigationStep() === NAVIGATION.CONFIGURE_BOARD) {
                    navigate(NAVIGATION.FLASH_FIRMWARE)
                    return
                }
                navigate(NAVIGATION.WELCOME)
            }}
            onClickAddBoards={(label, address) => {
                const type = hardwareType()[0]
                if (typeof hardwareType() === 'undefined') return
                setBoard({ label, address, hardwareType: type, mode: CONNECTION_STATUS.UNKNOWN })
            }}
            onClickDeleteBoard={setDeleteBoard}
            onClickEditBoard={setUpdateBoard}
        />
    )
}

export default SetupWizard
