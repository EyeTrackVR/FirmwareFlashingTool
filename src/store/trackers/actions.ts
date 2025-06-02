import { MODAL_TYPE } from '@interfaces/enums'
import { CONNECTION_STATUS } from '@interfaces/services/enums'
import { EyeTrackVrController } from '@src/Services/etvr/controller'
import { sleep } from '@src/utils'
import { setActiveModal } from '@store/ui/ui'
import { setLoadRotation, setTrackers } from './trackers'

export const loadState = async () => {
    const controller = new EyeTrackVrController()
    const serverStatus = await controller.getServerStatus()

    if (serverStatus === CONNECTION_STATUS.DISCONNECTED) {
        setActiveModal({
            open: true,
            type: MODAL_TYPE.ESTABLISH_CONNECTION,
        })

        await controller.establishConnection()

        await sleep(1000)
        setActiveModal({ open: false, type: MODAL_TYPE.NONE })
    }

    const state = await controller.getState()
    setTrackers(state.trackers)
    setLoadRotation(state.rotation)
}

export const updateState = async () => {
    const controller = new EyeTrackVrController()
    const state = await controller.getState()
    setTrackers(state.trackers)
    setLoadRotation(state.rotation)
}
