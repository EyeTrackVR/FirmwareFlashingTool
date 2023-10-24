import { ask } from '@tauri-apps/api/dialog'
import { removeFile } from '@tauri-apps/api/fs'
import { appConfigDir, join } from '@tauri-apps/api/path'
import { FaSolidTrashCan } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import { error, debug } from 'tauri-plugin-log-api'
import CustomButton from '@components/CustomButton'
import { ENotificationType } from '@src/static/types/enums'
import { useAppNotificationsContext } from '@store/context/notifications'

const EraseButton = () => {
    const [isButtonActive, setIsButtonActive] = createSignal(false)
    const { addNotification } = useAppNotificationsContext()

    const erase = async () => {
        const appConfigPath = await appConfigDir()
        const firmwarePath = await join(appConfigPath, 'merged-firmware.bin')
        const manifestPath = await join(appConfigPath, 'manifest.json')
        await removeFile(firmwarePath)
        await removeFile(manifestPath)
    }

    const handleOnClick = () => {
        ask('This action cannot be reverted. Are you sure?', {
            title: 'EyeTrackVR Erase Firmware Assets',
            type: 'warning',
        }).then((res) => {
            if (res) {
                erase()
                    .then(() => {
                        debug('[Erasing Firmware Assets]: Erased')
                        addNotification({
                            title: 'ETVR Firmware Assets Erased',
                            message: 'The firmware assets have been erased from your system.',
                            type: ENotificationType.SUCCESS,
                        })
                    })
                    .catch((err) => {
                        error(err)
                        addNotification({
                            title: 'ETVR Firmware Assets Erase Failed',
                            message: 'The firmware assets could not be erased from your system.',
                            type: ENotificationType.ERROR,
                        })
                    })
            }
        })
    }

    return (
        <CustomButton
            isButtonActive={isButtonActive()}
            tooltip="Erase Firmware Assets"
            icon={<FaSolidTrashCan size={45} fill="#FFFFFFe3" />}
            onClick={() => {
                setIsButtonActive(!isButtonActive())
                handleOnClick()
            }}
        />
    )
}

export default EraseButton
