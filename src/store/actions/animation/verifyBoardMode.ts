import { ACTION, UPDATE_NETWORK_WIZARD, WIRELESS_WIZARD_STEPS } from '@interfaces/animation/enums'
import { getApi } from '@src/esp'
import { DeviceMode } from '@src/esp/interfaces/types'
import { logger } from '@src/logger'
import { sleep } from '@src/utils'
import { setAction, setStep } from '@store/animation/animation'
import { activePort } from '@store/esp/selectors'
import { setAvailableNetworks } from '@store/network/network'
import { batch } from 'solid-js'

export const verifyBoardMode = async (modes: DeviceMode[]) => {
    batch(() => {
        logger.infoStart('Verify board mode')
        logger.add(`active port ${activePort()}`)
    })

    try {
        await sleep(200)
        const api = getApi()

        const deviceMode = await api.getDeviceMode(activePort())

        if (modes.every((mode) => mode !== deviceMode)) {
            batch(() => {
                setAction(ACTION.NEXT)
                setStep(UPDATE_NETWORK_WIZARD.UPDATE_NETWORK_INVALID_MODE)
            })
        } else {
            try {
                batch(() => {
                    setAction(ACTION.NEXT)
                    setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SCAN_FOR_NETWORKS)
                })

                const networks = await api.getAvailableNetworks(activePort())
                setAvailableNetworks(networks)
            } catch (err) {
                batch(() => {
                    logger.errorStart('get available networks ERROR')
                    logger.add(err instanceof Error ? err.message : `${err}`)
                    logger.errorEnd('get available networks ERROR')
                    setAvailableNetworks([])
                })
            }

            batch(() => {
                setAction(ACTION.NEXT)
                setStep(WIRELESS_WIZARD_STEPS.WIRELESS_SELECT_NETWORK)
            })
        }
    } catch (err) {
        batch(() => {
            setAction(ACTION.NEXT)
            setStep(UPDATE_NETWORK_WIZARD.UPDATE_NETWORK_VERYFICATION_FAILED)
            logger.errorStart('Verify board mode ERROR')
            logger.add(err instanceof Error ? err.message : `${err}`)
            logger.errorEnd('Verify board mode ERROR')
        })
    }

    logger.infoEnd('Verify board mode')
}
