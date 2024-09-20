import { useNavigate } from '@solidjs/router'
import { createEffect, createMemo, onCleanup, onMount } from 'solid-js'
import { ENotificationType, FLASH_STATUS, MODAL_TYPE } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import Terminal from '@pages/Terminal/Index'
import { espApi, UsbSerialPortInfo } from '@src/esp/api'
import { BoardConnectionMethod, DEFAULT_PORT_NAME, usb } from '@src/static'
import { download } from '@src/utils'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { getFirmwareLogs, installOpenIris, openDocs } from '@store/terminal/actions'
import {
    detailedLogs,
    firmwareState,
    isActiveProcess,
    logs,
    percentageProgress,
    simulationAbortController,
} from '@store/terminal/selectors'
import {
    restartFirmwareState,
    setAbortController,
    setProcessStatus,
} from '@store/terminal/terminal'

export const ManageFlashFirmware = () => {
    const {
        getFirmwareVersion,
        activeBoard,
        downloadAsset,
        getFirmwareType,
        setActivePortName,
        activePort,
        ports,
        setPorts,
    } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()
    const { setOpenModal, hideModal } = useAppUIContext()
    const navigate = useNavigate()

    onMount(() => {
        setAbortController()
        restartFirmwareState()
    })

    let hasCleared = false

    const loadPorts = (availablePorts: UsbSerialPortInfo[]) => {
        if (ports().length === availablePorts.length) return

        if (!availablePorts.length) {
            if (!hasCleared) {
                setActivePortName(DEFAULT_PORT_NAME, true)
                setPorts([])
                hasCleared = true
            }
            return
        }

        hasCleared = false

        const portList: IDropdownList[] = availablePorts.map((port) => ({
            label: port.portName,
            description:
                port?.product && port?.manufacturer
                    ? `(${port.manufacturer}) ${port.product}`
                    : `${port.vid}:${port.pid}`,
        }))

        if (activePort().autoSelect) {
            setActivePortName(portList[0]?.label ?? DEFAULT_PORT_NAME, true)
        }

        setPorts(portList)
    }

    const onLoadError = () => {
        addNotification({
            title: 'Failed to load ports',
            message: 'Failed to load ports',
            type: ENotificationType.ERROR,
        })
    }

    createEffect(() => {
        const interval = setInterval(() => {
            espApi.availablePorts().then(loadPorts).catch(onLoadError)
        }, 250)

        onCleanup(() => clearInterval(interval))
    })

    const flashFirmwareState = createMemo(() => {
        return Object.keys(firmwareState()).map((key) => {
            return { step: key, ...firmwareState()[key] }
        })
    })

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(usb)
    })

    const notification = createMemo(() => {
        return {
            title: 'There is an active installation. Please wait.',
            message: 'There is an active installation. Please wait.',
            type: ENotificationType.INFO,
        }
    })

    const board = createMemo(() => {
        const connectionMethod = BoardConnectionMethod[activeBoard().replace('_release', '')]
        return connectionMethod ? `${activeBoard()} (${connectionMethod})` : activeBoard()
    })

    const activePortName = createMemo(() => {
        return activePort().activePortName
    })

    return (
        <Terminal
            activePort={activePort()}
            ports={ports()}
            board={board()}
            isUSBBoard={isUSBBoard()}
            percentageProgress={percentageProgress()}
            logs={logs()}
            isActiveProcess={isActiveProcess()}
            onClickOpenDocs={openDocs}
            firmwareVersion={`Openiris-${getFirmwareVersion()}`}
            firmwareState={flashFirmwareState().filter((el) => el?.status !== FLASH_STATUS.NONE)}
            onClickPort={(port) => {
                setActivePortName(port, false)
                const elem: Element | null = document.activeElement
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }
            }}
            onClickInstallOpenIris={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
                    return true
                }
                if (!hideModal()) {
                    setOpenModal({ open: true, type: MODAL_TYPE.BEFORE_FLASHING })
                    return true
                }
                setAbortController('openiris')
                setProcessStatus(true)
                restartFirmwareState()
                installOpenIris(
                    isUSBBoard(),
                    activePortName(),
                    async () => {
                        await downloadAsset(getFirmwareType())
                    },
                    () => {
                        setOpenModal({ open: true, type: MODAL_TYPE.UPDATE_NETWORK })
                    },
                ).catch(() => ({}))
            }}
            onClickGetLogs={() => {
                if (activePortName() === DEFAULT_PORT_NAME) return
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController('logs')
                getFirmwareLogs(activePortName(), simulationAbortController()).catch(() => {})
            }}
            onClickDownloadLogs={() => {
                if (!detailedLogs().toString()) {
                    addNotification({
                        title: 'No logs found',
                        message: 'No logs found.',
                        type: ENotificationType.INFO,
                    })
                    return
                }
                download(detailedLogs().toString(), 'esp-web-tools-logs.txt')
            }}
            onClickUpdateNetwork={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController()
                setOpenModal({ open: true, type: MODAL_TYPE.UPDATE_NETWORK })
            }}
            onClickAPMode={() => {
                if (activePortName() === DEFAULT_PORT_NAME) return
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController()
                setOpenModal({ open: true, type: MODAL_TYPE.AP_MODE })
            }}
            onClickBack={() => {
                if (isActiveProcess()) {
                    addNotification(notification())
                    return
                }
                setAbortController()
                navigate(isUSBBoard() ? '/' : '/network')
            }}
        />
    )
}

export default ManageFlashFirmware
