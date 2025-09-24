import { ENotificationType, MODAL_TYPE } from '@interfaces/enums'
import Terminal from '@pages/Terminal'
import { useNavigate } from '@solidjs/router'
import { download } from '@src/utils'
import { useAppAPIContext } from '@store/context/api'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { getFirmwareLogs } from '@store/terminal/actions'
import { detailedLogs, simulationAbortController } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'
import { createMemo } from 'solid-js'

export const TerminalContainer = () => {
    const { getFirmwareVersion, activePort, ports } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()
    const { setOpenModal } = useAppUIContext()
    const navigate = useNavigate()

    const activePortName = createMemo(() => {
        return activePort().activePortName
    })

    return (
        <Terminal
            activePortName={activePortName()}
            ports={ports()}
            logs={detailedLogs()}
            firmwareVersion={`Openiris-${getFirmwareVersion()}`}
            onClickSelectPort={() => {
                setOpenModal({ open: true, type: MODAL_TYPE.SELECT_PORT })
            }}
            onClickGetLogs={() => {
                if (!activePortName()) return
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
            onClickBack={() => {
                setAbortController('logs')
                navigate('/')
            }}
        />
    )
}

export default TerminalContainer
