import { debug } from 'tauri-plugin-log-api'

import AppSettings from '@src/views/AppSettings'

const AppSettingsPage = () => {
    return (
        <div class="flex justify-center items-center content-center flex-col pt-[100px] text-white">
            <AppSettings
                onChange={(format, value) => {
                    debug(`[AppSettings]: ${format} ${value}`)
                }}
                onNetworkSettingsChange={(format) => {
                    debug(`[AppSettings]: ${format}`)
                }}
            />
        </div>
    )
}

export default AppSettingsPage
