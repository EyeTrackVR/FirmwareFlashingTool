import { ask } from '@tauri-apps/api/dialog'
import { removeFile } from '@tauri-apps/api/fs'
import { appConfigDir, join } from '@tauri-apps/api/path'
import { error, debug } from 'tauri-plugin-log-api'
import Button from '..'
import { ENotificationType } from '@src/static/types/enums'
import { useAppNotificationsContext } from '@store/context/notifications'

export const EraseButton = () => {
    const { addNotification } = useAppNotificationsContext()

    const erase = async () => {
        const appConfigPath = await appConfigDir()
        const firmwarePath = await join(appConfigPath, 'merged-firmware.bin')
        const manifestPath = await join(appConfigPath, 'manifest.json')
        await removeFile(firmwarePath)
        await removeFile(manifestPath)
    }

    return (
        <Button
            color="#f44336"
            shadow="0 0 10px #f44336"
            text="Erase Firmware Assets"
            onClick={() => {
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
                                    message:
                                        'The firmware assets have been erased from your system.',
                                    type: ENotificationType.SUCCESS,
                                })
                            })
                            .catch((err) => {
                                error(err)
                                addNotification({
                                    title: 'ETVR Firmware Assets Erase Failed',
                                    message:
                                        'The firmware assets could not be erased from your system.',
                                    type: ENotificationType.ERROR,
                                })
                            })
                    }
                })
            }}
        />
    )
}
