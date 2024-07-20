import { FLASH_STATUS, FLASH_STEP } from '@interfaces/enums'
import { IFlashState } from '@interfaces/interfaces'

export const logs: Record<FLASH_STEP, Record<Exclude<FLASH_STATUS, 'NONE'>, IFlashState>> = {
    [FLASH_STEP.BOARD_CONNECTION]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Connecting to the board... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Connected to the board!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Failed to connect to the board!',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
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
    [FLASH_STEP.INITIALIZE]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Initializing ESP workspace... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'ESP workspace initialized successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to initialize ESP workspace.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
    [FLASH_STEP.LOGS]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Downloading logs... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Logs downloaded successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Failed to download logs.',
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
    [FLASH_STEP.CHIP_FAMILY]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Determining chip family... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Chip family determined successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to determine chip family.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
    [FLASH_STEP.BUILD]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Preparing firmware... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Preparing firmware completed successfully!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Preparing firmware failed.',
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
    [FLASH_STEP.DOWNLOAD_FILES]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Downloading files... please wait',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Successfully downloaded files!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to download files.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
    [FLASH_STEP.OPEN_PORT]: {
        [FLASH_STATUS.UNKNOWN]: {
            status: FLASH_STATUS.UNKNOWN,
            label: 'Trying to open port... Please wait.',
        },
        [FLASH_STATUS.SUCCESS]: {
            status: FLASH_STATUS.SUCCESS,
            label: 'Successfully opened port!',
        },
        [FLASH_STATUS.FAILED]: {
            status: FLASH_STATUS.FAILED,
            label: 'Error: Failed to open port.',
        },
        [FLASH_STATUS.ABORTED]: {
            status: FLASH_STATUS.ABORTED,
            label: 'process aborted.',
        },
    },
}
