import { ENotificationType, MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import SelectPortModal from '@pages/Modals/SelectPortModal'
import { espApi, UsbSerialPortInfo } from '@src/esp/api'
import { DEFAULT_PORT_NAME } from '@src/static'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { appWindow } from '@tauri-apps/api/window'
import { createEffect, createMemo, on, onCleanup } from 'solid-js'

const SelectPortModalContainer = () => {
    const { setActivePortName, activePort, ports, setPorts } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()
    const { modal, setOpenModal } = useAppUIContext()

    const loadPorts = (availablePorts: UsbSerialPortInfo[]) => {
        if (ports().length === availablePorts.length) return

        if (!availablePorts.length) {
            setActivePortName('', false)
            setPorts([])
            return
        }

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

    const isModalActive = createMemo(() => {
        return modal().type === MODAL_TYPE.SELECT_PORT
    })

    createEffect(
        on(isModalActive, (status) => {
            const interval = setInterval(() => {
                espApi
                    .availablePorts()
                    .then(loadPorts)
                    .catch(() => {
                        addNotification({
                            title: 'Failed to load ports',
                            message: 'Failed to load ports',
                            type: ENotificationType.ERROR,
                        })
                    })
            }, 250)

            if (!status) {
                clearInterval(interval)
            }

            onCleanup(() => clearInterval(interval))
        }),
    )

    return (
        <SelectPortModal
            version="1.7.0"
            ports={ports()}
            activeBoard={activePort().activePortName}
            isActive={modal().type === MODAL_TYPE.SELECT_PORT}
            onClickHeader={(action: TITLEBAR_ACTION) => {
                switch (action) {
                    case TITLEBAR_ACTION.MINIMIZE:
                        appWindow.minimize()
                        break
                    case TITLEBAR_ACTION.MAXIMIZE:
                        appWindow.toggleMaximize()
                        break
                    case TITLEBAR_ACTION.CLOSE:
                        appWindow.close()
                        break
                    default:
                        return
                }
            }}
            onClickClose={() => {
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
            onClickConfirmBoard={(port) => {
                setActivePortName(port, false)
                setOpenModal({ open: false, type: MODAL_TYPE.NONE })
            }}
        />
    )
}

export default SelectPortModalContainer
