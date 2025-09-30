import {
    ACTION,
    FLASH_MODE,
    SELECT_PORT_WIZARD,
    WIRED_WIZARD_STEPS,
    WIRELESS_WIZARD_STEPS,
} from '@interfaces/enums'
import { getApi } from '@src/esp'
import { logger } from '@src/logger'
import { setAction, setStep } from '@store/animation/animation'
import { selectedMode } from '@store/animation/selectors'
import { setActivePort } from '@store/esp/esp'
import { activePort } from '@store/esp/selectors'
import { setAvailableNetworks } from '@store/network/network'
import { batch } from 'solid-js'

export const verifyPortConnection = async () => {
    batch(() => {
        logger.infoStart('Verify Port connection')
        logger.add('active port: ' + activePort())
        logger.add('selected mode: ' + selectedMode())
        setAction(ACTION.NEXT)
        setStep(SELECT_PORT_WIZARD.SELECT_CHECK_PORT_CONNECTION)
    })

    const api = getApi()

    try {
        await api.switchDeviceMode(
            activePort(),
            selectedMode() === FLASH_MODE.WIRED ? 'uvc' : 'wifi',
        )

        const isTheSamePort = await api.checkPortConnection(activePort())

        if (isTheSamePort) {
            if (selectedMode() === FLASH_MODE.WIRED) {
                batch(() => {
                    setAction(ACTION.NEXT)
                    setStep(WIRED_WIZARD_STEPS.WIRED_SETUP_TRACKER_NAME)
                })
            } else {
                batch(() => {
                    setAction(ACTION.NEXT)
                    setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SETUP_WIRELESS_MODE)
                })

                try {
                    const networks = await api.getAvailableNetworks(activePort())
                    setAvailableNetworks(networks)
                } catch (err) {
                    setAvailableNetworks([])
                }

                batch(() => {
                    setAction(ACTION.NEXT)
                    setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
                })
            }
        } else {
            batch(() => {
                setAction(ACTION.NEXT)
                setActivePort('')
                setStep(SELECT_PORT_WIZARD.SELECT_PORT)
            })
        }
    } catch (err) {
        batch(() => {
            logger.errorStart('Verify Port connection ERROR')
            logger.add(err instanceof Error ? err.message : `${err}`)
            logger.errorEnd('Verify Port connection ERROR')
            setAction(ACTION.NEXT)
            setActivePort('')
            setStep(SELECT_PORT_WIZARD.SELECT_PORT)
        })
    }

    logger.infoEnd('Verify Port connection')
}
