import { TRACKER_POSITION } from '@interfaces/boards/enums'
import { IBoard } from '@interfaces/boards/interfaces'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import BoardImportWizard from '@pages/BoardImportWizard'
import { useNavigate } from '@solidjs/router'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { sleep } from '@src/utils'
import { boards } from '@store/boards/selectors'
import { openDocs } from '@store/terminal/actions'
import { navigationStep, serverStatus } from '@store/ui/selectors'

const BoardImportWizardRoot = () => {
    const navigate = useNavigate()

    const updateTrackersConfig = async (
        boards: IBoard[],
    ): Promise<Record<TRACKER_POSITION, string>> => {
        let retries = 3
        const client = getEyeTrackVrController()

        while (retries > 0) {
            try {
                await client.updateBoardCameraConfigurations(boards)
                const streams = await client.getCamerasStream(boards)
                return streams
            } catch (error) {
                retries--
                if (retries > 0) {
                    await sleep(500)
                } else {
                    const config = await client.getCamerasStream(boards)
                    return config
                }
            }
        }

        const config = await client.getCamerasStream(boards)
        return config
    }

    const checkServerStatus = async (): Promise<CONNECTION_STATUS> => {
        const client = getEyeTrackVrController()
        const status = await client.establishConnection()
        return status
    }

    return (
        <BoardImportWizard
            checkServerStatus={checkServerStatus}
            serverStatus={serverStatus()}
            updateTrackersConfig={updateTrackersConfig}
            boards={boards()}
            onClickAddTrackers={(boards) => {
                // setBoards(boards)
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
