import { type IDropdownList } from '@interfaces/interfaces'
import { ConfigureBoardWizard } from '@pages/ConfigureBoardWizard'
import { useNavigate } from '@solidjs/router'
import { supportedBoards, USB } from '@src/static'
import { MODAL_TYPE, TITLEBAR_ACTION } from '@src/static/types/enums'
import { BoardDescription, ChannelOptions } from '@src/static/ui'
import { useAppAPIContext } from '@src/store/context/api'
import { isValidChannel } from '@src/utils'
import { setIsSoftwareDownloaded } from '@store/terminal/terminal'
import { serverStatus } from '@store/ui/selectors'
import { setActiveModal } from '@store/ui/ui'
import { appWindow } from '@tauri-apps/api/window'
import { Accessor, createMemo } from 'solid-js'
import { trace } from 'tauri-plugin-log-api'

export const ConfigureBoardWizardRoot = () => {
    const navigate = useNavigate()
    const {
        getFirmwareAssets,
        getFirmwareVersion,
        confirmFirmwareSelection,
        activeBoard,
        channelMode,
        setChannelMode,
    } = useAppAPIContext()

    const boards: Accessor<IDropdownList[]> = createMemo(() => {
        return getFirmwareAssets()
            .map((item) => {
                trace(`${item.name}`)
                return {
                    label: item.name,
                    description: BoardDescription[item.name.replace('_release', '')] ?? '--',
                }
            })
            .sort((boardA, boardB) => {
                const boardALabel = boardA.label.replace('_release', '')
                const boardBLabel = boardB.label.replace('_release', '')
                const isBoardARelease = boardA.label.includes('_release')
                const isBoardBRelease = boardB.label.includes('_release')

                const boardAIsSupported = supportedBoards.includes(boardALabel)
                const boardBIsSupported = supportedBoards.includes(boardBLabel)

                if (boardAIsSupported && boardBIsSupported) {
                    if (isBoardARelease && !isBoardBRelease) return 1
                    if (!isBoardARelease && isBoardBRelease) return -1
                }

                if (boardAIsSupported && !boardBIsSupported) return -1
                if (!boardAIsSupported && boardBIsSupported) return 1

                return 0
            })
    })

    const firmwareVersion = createMemo(() => {
        return getFirmwareVersion?.() ?? ''
    })

    const isUSBBoard = createMemo(() => {
        return activeBoard().includes(USB)
    })

    return (
        <ConfigureBoardWizard
            onClickSettings={() => {
                navigate('/settings')
            }}
            appVersion={'1.7.0'}
            serverStatus={serverStatus()}
            boards={boards()}
            onClickBack={() => navigate('/')}
            lockButton={!(!activeBoard() || !firmwareVersion())}
            channelMode={channelMode()}
            channelOptions={Object.values(ChannelOptions)}
            activeBoard={activeBoard()}
            firmwareVersion={firmwareVersion()}
            onClickSetChannelMode={(label) => {
                if (!isValidChannel(label)) {
                    return
                }
                const elem: Element | null = document.activeElement
                setChannelMode(label)
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }
            }}
            onClickConfirm={() => {
                if (!activeBoard() || !firmwareVersion()) {
                    return
                }
                navigate(isUSBBoard() ? '/flashFirmware' : '/network')
            }}
            onSubmit={(value) => {
                const elem: Element | null = document.activeElement
                if (elem instanceof HTMLElement) {
                    elem?.blur()
                }

                if (activeBoard() === value) return
                if (value.match(/_release/)) {
                    setActiveModal({
                        open: true,
                        type: MODAL_TYPE.BEFORE_SELECT_BOARD,
                        board: value,
                    })
                    return
                }
                setIsSoftwareDownloaded(false)
                confirmFirmwareSelection(value)
            }}
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
            onClickOpenModal={(id) => {
                const el = document.getElementById(id)
                if (el instanceof HTMLDialogElement) {
                    el.showModal()
                }
            }}
        />
    )
}

export default ConfigureBoardWizardRoot
