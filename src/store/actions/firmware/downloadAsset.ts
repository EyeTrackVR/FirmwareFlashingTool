import { ghAPI } from '@store/firmware/selectors'
import { removeFile } from '@tauri-apps/api/fs'
import { appDataDir, join } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/tauri'
import { debug, trace } from 'tauri-plugin-log-api'
import { download } from 'tauri-plugin-upload-api'

const getRelease = async (firmware: string) => {
    const appDataDirPath = await appDataDir()
    if (firmware === '' || firmware.length === 0) {
        debug('[Github Release]: No firmware selected')
        throw new Error('A firmware must be selected before downloading')
    }

    trace(`[Github Release]: App Data Dir: ${appDataDirPath}`)

    // check if the firmware chosen matches the one names in the firmwareAssets array of objects
    const firmwareAsset = ghAPI().assets.find((asset) => asset.name === firmware)

    trace(`[Github Release]: Firmware Asset: ${firmwareAsset}`)

    if (firmwareAsset) {
        debug(`[Github Release]: Downloading firmware: ${firmware}`)
        debug(`[Github Release]: Firmware URL: ${firmwareAsset}`)

        // parse out the file name from the firmwareAsset.url and append it to the appConfigDirPath
        const fileName =
            firmwareAsset.browser_download_url.split('/')[
                firmwareAsset.browser_download_url.split('/').length - 1
            ]

        const path = await join(appDataDirPath, fileName)
        trace(`[Github Release]: Path: ${path}`)

        // get the latest release
        const response = await download(
            firmwareAsset.browser_download_url,
            path,
            (progress, total) => {
                debug(`[Github Release]: Downloaded ${progress} of ${total} bytes`)
            },
        )
        debug(`[Github Release]: Download Response: ${response}`)

        const res = await invoke('unzip_archive', {
            archivePath: path,
            targetDir: appDataDirPath,
        })

        await removeFile(path)

        debug(`[Github Release]: Unzip Response: ${res}`)
    } else {
        throw new Error('Selected board is not supported')
    }
}

export const downloadAsset = async (firmware: string): Promise<void> => {
    const response = await getRelease(firmware)
    debug(`[Github Release]: Download Response: ${response}`)
}
