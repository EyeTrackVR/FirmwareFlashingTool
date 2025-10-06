import { MODAL_TYPE } from '@interfaces/animation/enums'
import { NOTIFICATION_TYPE } from '@interfaces/notifications/enums'
import Terminal from '@pages/Terminal'
import { useNavigate } from '@solidjs/router'
import { download } from '@src/utils'
import { addNotification } from '@store/actions/notifications/addNotification'
import { getFirmwareLogs } from '@store/actions/terminal/getFirmwareLogs'
import { activePort, ports } from '@store/esp/selectors'
import { ghAPI } from '@store/firmware/selectors'
import { detailedLogs, simulationAbortController } from '@store/terminal/selectors'
import { setAbortController } from '@store/terminal/terminal'
import { setOpenModal } from '@store/ui/ui'
import { onCleanup } from 'solid-js'

export const TerminalContainer = () => {
    const navigate = useNavigate()

    onCleanup(() => {
        setAbortController('logs')
    })

    return (
        <Terminal
            activePortName={activePort()}
            ports={ports()}
            logs={detailedLogs()}
            firmwareVersion={`Openiris-${ghAPI().version}`}
            onClickSelectPort={() => {
                setOpenModal({ open: true, type: MODAL_TYPE.SELECT_PORT })
            }}
            onClickGetLogs={() => {
                if (!activePort()) {
                    addNotification({
                        title: 'No port selected',
                        message: 'No port selected',
                        type: NOTIFICATION_TYPE.INFO,
                    })
                    return
                }
                setAbortController('logs')
                getFirmwareLogs(activePort(), simulationAbortController()).catch(() => {})
            }}
            onClickDownloadLogs={() => {
                if (!detailedLogs().toString()) {
                    addNotification({
                        title: 'No logs found',
                        message: 'No logs found.',
                        type: NOTIFICATION_TYPE.INFO,
                    })
                    return
                }
                download(detailedLogs().toString(), 'esp-web-tools-logs.txt')
            }}
            onClickBack={() => {
                navigate('/')
            }}
        />
    )
}

export default TerminalContainer
