import { FLASH_STATUS, FLASH_STEP } from '@interfaces/enums'
import { type IFlashState } from '@store/terminal/terminal'

export const logs: Record<FLASH_STEP, Record<Exclude<FLASH_STATUS, 'NONE'>, IFlashState>> = {
    [FLASH_STEP.REQUEST_PORT]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Attempting to connect to the requested port... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Successfully connected to the port!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to connect to the port.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
    [FLASH_STEP.MANIFEST_PATH]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Fetching manifest path... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Manifest path retrieved successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to fetch the manifest path.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
    [FLASH_STEP.FLASH_FIRMWARE]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Flashing firmware... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Firmware flashed successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to flash firmware.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
}
