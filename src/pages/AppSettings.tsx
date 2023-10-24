import { debug } from 'tauri-plugin-log-api'
import { useAppAPIContext } from '@src/store/context/api'
import { useAppNotificationsContext } from '@src/store/context/notifications'
import AppSettings from '@src/views/AppSettings'

const AppSettingsPage = () => {
    let download: (firmware: string) => Promise<void> = () => Promise.resolve()

    const { downloadAsset } = useAppAPIContext()

    if (downloadAsset) download = downloadAsset

    const { handleSound } = useAppNotificationsContext()

    return (
        <div class="flex justify-center items-center content-center flex-col pt-[100px] text-white">
            <AppSettings
                onChange={(format, value) => {
                    debug(`[AppSettings]: ${format} ${value}`)
                }}
                onNetworkSettingsChange={(format) => {
                    debug(`[AppSettings]: ${format}`)
                }}
                onClickDownload={() => {
                    download('esp32AIThinker')
                    debug('[Download Asset]: Downloading...')
                }}
                onClickPlaySound={() => {
                    handleSound('EyeTrackApp_Audio_start.wav')
                    debug('[Audio Handler]: Sound Played')
                }}
            />
        </div>
    )
}

export default AppSettingsPage
