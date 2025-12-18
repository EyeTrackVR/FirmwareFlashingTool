import { ACTION, DEVICE_MODE_WIZARD } from '@interfaces/animation/enums'
import { getApi } from '@src/esp'
import { DeviceMode } from '@src/esp/interfaces/types'
import { logger } from '@src/logger'
import { setAction, setStep } from '@store/animation/animation'
import { setDeviceMode } from '@store/esp/esp'
import { activePort } from '@store/esp/selectors'
import { batch } from 'solid-js'

export const detectDeviceMode = async () => {
    batch(() => {
        logger.functionStart('detectDeviceMode')
        logger.add('active port: ' + activePort())
    })

    try {
        const api = getApi()
        await api.pause(activePort())

        const deviceMode = await api.getDeviceMode(activePort())
        batch(() => {
            setAction(ACTION.NEXT)
            setDeviceMode(deviceMode)
            setStep(DEVICE_MODE_WIZARD.DEVICE_SELECT_DEVICE_MODE)
        })
    } catch (err) {
        batch(() => {
            setAction(ACTION.NEXT)
            setStep(DEVICE_MODE_WIZARD.DETECT_DEVICE_MODE_FAILED)
            logger.errorStart('detect device mode ERRROR ')
            logger.add(err instanceof Error ? err.message : `${err}`)
            logger.errorEnd('detect device mode ERRROR ')
        })
    }
    logger.functionEnd('detectDeviceMode')
}
