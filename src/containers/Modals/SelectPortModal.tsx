import { MODAL_TYPE, TITLEBAR_ACTION } from '@interfaces/enums'
import { IDropdownList } from '@interfaces/interfaces'
import SelectPortModal from '@pages/Modals/SelectPortModal'
import { getApi } from '@src/esp'
import { UsbSerialPortInfo } from '@src/esp/interfaces/types'
import { logger } from '@src/logger'
import { useAppAPIContext } from '@store/context/api'
import { useAppUIContext } from '@store/context/ui'
import { appWindow } from '@tauri-apps/api/window'
import { batch, createEffect, createMemo, on, onCleanup } from 'solid-js'

const SelectPortModalContainer = () => {
    const { setActivePortName, activePort, ports, setPorts } = useAppAPIContext()
    const { modal, setOpenModal } = useAppUIContext()

    const loadPorts = (availablePorts: UsbSerialPortInfo[]) => {
        const portList: IDropdownList[] = availablePorts.map((port) => ({
            label: port.portName,
            description:
                port?.product && port?.manufacturer
                    ? `(${port.manufacturer}) ${port.product}`
                    : `${port.vid}:${port.pid}`,
        }))

        if (JSON.stringify(portList) === JSON.stringify(ports())) return

        if (!availablePorts.length) {
            setActivePortName('')
            setPorts([])
            return
        }

        setPorts(portList)
    }

    const isModalActive = createMemo(() => {
        return modal().type === MODAL_TYPE.SELECT_PORT
    })

    createEffect(
        on(isModalActive, (status) => {
            const interval = setInterval(() => {
                getApi()
                    .getAvailablePorts()
                    .then(loadPorts)
                    .catch(() => {
                        setPorts([])
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
            onClickConfirmPort={(port) => {
                batch(() => {
                    logger.infoStart('SelectPortModalContainer')
                    logger.add('onClickConfirmPort')
                    logger.add(`Selected port: ${port}`)
                    setActivePortName(port)
                    setOpenModal({ open: false, type: MODAL_TYPE.NONE })
                    logger.infoEnd('SelectPortModalContainer')
                })
            }}
        />
    )
}

export default SelectPortModalContainer
