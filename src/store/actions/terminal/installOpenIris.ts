import { ACTION, FLASH_STATUS, FLASH_STEP, FLASH_WIZARD_STEPS } from '@interfaces/animation/enums'
import { getApi } from '@src/esp'
import { logger } from '@src/logger'
import { logs as logsDescription } from '@static/index'
import { setAction, setStep } from '@store/animation/animation'
import {
    clearLogs,
    setInstallationProgress,
    setProcessStatus,
    updateFirmwareState,
} from '@store/terminal/terminal'

const updateState = (step: FLASH_STEP, status: FLASH_STATUS, error?: Error) => {
    if (status === FLASH_STATUS.FAILED) {
        setProcessStatus(false)
    }

    updateFirmwareState({
        step,
        object: {
            ...logsDescription[step][status],
            errorName: error?.name ?? undefined,
        },
    })
}

const runStep = async (step: FLASH_STEP, action: () => Promise<void>): Promise<void> => {
    updateState(step, FLASH_STATUS.UNKNOWN)

    try {
        logger.add(step)
        await action()
    } catch (error) {
        logger.infoStart('installOpenIris, runStep, ERROR')

        setAction(ACTION.NEXT)
        setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS_FAILED)

        if (error instanceof Error) {
            logger.add(error.message)

            updateState(step, FLASH_STATUS.FAILED, error)
            return
        }

        if (typeof error === 'string' && error.match(/Unknown port/)) {
            logger.add(`${error}, Unknown port`)
            updateState(
                step,
                FLASH_STATUS.FAILED,
                new Error(
                    `No port selected by the user, or the board is not connected.  error: ${error}`,
                ),
            )
            throw error
        }

        logger.add(
            typeof error === 'string'
                ? new Error(error).message
                : `This message should not be seen`,
        )

        updateState(
            step,
            FLASH_STATUS.FAILED,
            typeof error === 'string' ? new Error(error) : undefined,
        )

        logger.infoEnd('installOpenIris, runStep, ERROR')
        throw error
    }

    updateState(step, FLASH_STATUS.SUCCESS)
}

export const installOpenIris = async (portName: string, downloadManifest: () => Promise<void>) => {
    clearLogs()
    try {
        logger.infoStart('installOpenIris')

        await runStep(FLASH_STEP.REQUEST_PORT, async () => {
            await getApi().validateConnection(portName)
        })

        await runStep(FLASH_STEP.MANIFEST_PATH, async () => {
            await downloadManifest()
        })

        await runStep(FLASH_STEP.FLASH_FIRMWARE, async () => {
            await getApi().flash(portName, (progress) => {
                setInstallationProgress(progress)
                if (progress >= 100) {
                    setAction(ACTION.NEXT)
                    setStep(FLASH_WIZARD_STEPS.FLASH_PROCESS_SUCCESS)
                }
            })
        })

        logger.infoEnd('installOpenIris')
    } catch {
        return
    }
    setProcessStatus(false)
}
