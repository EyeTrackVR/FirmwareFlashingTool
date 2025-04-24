import { MODAL_TYPE } from '@interfaces/enums'
import { EyeTrackVrController } from '@src/Services/etvr/controller'
import { sleep } from '@src/utils'
import { setActiveModal } from '@store/ui/ui'
import { setTrackers } from './trackers'

export const loadTrackersState = async () => {
    const controller = new EyeTrackVrController()

    setActiveModal({
        open: true,
        type: MODAL_TYPE.ESTABLISH_CONNECTION,
    })

    await controller.establishConnection()

    await sleep(1000)
    setActiveModal({ open: false, type: MODAL_TYPE.NONE })

    const trackers = await controller.getTrackers()
    setTrackers(trackers)
}
