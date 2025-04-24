import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { TRACKER_POSITION } from '@interfaces/trackers/enums'
import { ITracker } from '@interfaces/trackers/interfaces'
import BoardImportWizard from '@pages/BoardImportWizard'
import { useNavigate } from '@solidjs/router'
import { getEyeTrackVrController } from '@src/Services/etvr/connection'
import { sleep } from '@src/utils'
import { openDocs } from '@store/terminal/actions'
import { navigationStep, serverStatus } from '@store/ui/selectors'

const BoardImportWizardRoot = () => {
    const navigate = useNavigate()

    const updateTrackersConfig = async (
        trackers: ITracker[],
    ): Promise<Record<TRACKER_POSITION, string>> => {
        let retries = 3
        const client = getEyeTrackVrController()

        while (retries > 0) {
            try {
                await client.updateTrackerCameraConfigurations(trackers)
                const streams = await client.getTrackersStream(trackers)
                return streams
            } catch (error) {
                retries--
                if (retries > 0) {
                    await sleep(500)
                } else {
                    const config = await client.getTrackersStream(trackers)
                    return config
                }
            }
        }

        const config = await client.getTrackersStream(trackers)
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
            onClickAddTrackers={(trackers) => {
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
