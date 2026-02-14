import { CHANNEL_TYPE, REST_STATUS } from '@interfaces/firmware/enums'
import { formatDeviceName } from '@src/utils'
import { GHEndpoints } from '@static/index'
import {
    clearGHApiState,
    IGHResponse,
    setFirmwareAssets,
    setFirmwareVersion,
    setGHRestStatus,
} from '@store/firmware/firmware'
import { ghAPI } from '@store/firmware/selectors'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs'
import { getClient, ResponseType } from '@tauri-apps/api/http'
import { debug, error, trace, warn } from 'tauri-plugin-log-api'

const setGHData = (data: IGHResponse, update: boolean) => {
    if (data?.name === undefined) {
        setFirmwareVersion('----')
    } else {
        setFirmwareVersion(data['name'])
    }
    trace(`[Github Response Data]: ${JSON.stringify(data)}`)

    const assets = data.assets

    const download_urls = assets.map(
        (asset: { browser_download_url: string }) => asset.browser_download_url,
    )

    const firmware_assets = assets.map((asset: { name: string }) => asset.name)

    // split the firmware_assets array of strings on the first dash and return the first element of the array
    const boardName = firmware_assets.map((asset: string) => {
        return formatDeviceName(asset)
    })

    // set the board name in the store
    for (let i = 0; i < boardName.length; i++) {
        debug(`[Github Release]: Board Name: ', ${boardName[i]}`)
        debug(`[Github Release]: URLs:, ${download_urls[i]}`)
        setFirmwareAssets({ name: boardName[i], browser_download_url: download_urls[i] })
    }

    if (update) {
        writeTextFile(
            'config.json',
            JSON.stringify({
                version: ghAPI().version,
                assets: ghAPI().assets,
            }),
            {
                dir: BaseDirectory.AppConfig,
            },
        )
            .then(() => {
                debug(
                    update
                        ? '[Config Updated]: Config Updated Successfully'
                        : '[Config Created]: Config Created Successfully',
                )
            })
            .catch((err) => {
                error('[Config Creation Error]:', err)
            })
    }
}

export const doGHRequest = async (channelType: CHANNEL_TYPE) => {
    try {
        clearGHApiState()
        const client = await getClient()
        const endpoint = GHEndpoints[channelType]

        setGHRestStatus(REST_STATUS.ACTIVE)
        setGHRestStatus(REST_STATUS.LOADING)

        debug(`[Github Release]: Github Endpoint ${endpoint}`)

        try {
            const response = await client.get<IGHResponse>(endpoint, {
                timeout: 30,
                // the expected response type
                headers: {
                    'User-Agent': 'EyeTrackVR',
                },
                responseType: ResponseType.JSON,
            })
            // if (!Array.isArray(githubResponse.data)) {
            //     response = githubResponse
            // } else {
            //     // const preReleases = githubResponse.data.filter(({ prerelease }) => prerelease)
            //     // response = {
            //     //     ...githubResponse,
            //     //     data: { ...preReleases[0] },
            //     // }
            // }

            trace(`[Github Response]: ${JSON.stringify(response)}`)

            if (!response.ok) {
                debug('[Github Release Error]: Cannot Access Github API Endpoint')
                return
            }

            debug(`[OpenIris Version]: ${response.data['name']}`)

            try {
                const config = await readTextFile('config.json', {
                    dir: BaseDirectory.AppConfig,
                })
                const config_json = JSON.parse(config)
                trace(`[Config]: ${JSON.stringify(config_json)}`)
                if ((!response.ok || !(response instanceof Object)) && config === '') {
                    warn('[Config Exists]: Most likely rate limited')
                    setGHData(config_json, false)
                    setGHRestStatus(REST_STATUS.COMPLETE)
                    return
                }
                if (response.data.name === config_json.version) {
                    debug('[Config Exists]: Config Exists and is up to date')
                    setGHData(response.data, false)
                    return
                }

                // update config
                setGHData(response.data, true)
                debug('[Config Exists]: Config Exists and is out of date - Updating')
                setGHRestStatus(REST_STATUS.COMPLETE)
                return
            } catch (err) {
                setGHRestStatus(REST_STATUS.NO_CONFIG)
                if (response.ok) {
                    error(`[Config Read Error]: ${err} Creating config.json`)
                    setGHData(response.data, true)
                    setGHRestStatus(REST_STATUS.COMPLETE)
                }
            }
        } catch (err) {
            setGHRestStatus(REST_STATUS.FAILED)
            error(`[Github Release Error]: ${err}`)
            const config = await readTextFile('config.json', {
                dir: BaseDirectory.AppConfig,
            })
            if (!config) {
                setGHRestStatus(REST_STATUS.NO_CONFIG)
                error(`[Config Read Error]: Config does not exist ${err}`)
            }
            const config_json = JSON.parse(config)
            debug(`[OpenIris Version]: ${config_json.version}`)
            trace(`[Config.JSON Contents]:${config_json}`)
            if (config !== '') {
                debug('[Config Exists]: Config Exists and is up to date')
                setGHData(config_json, false)
                return
            }
            setGHRestStatus(REST_STATUS.NO_CONFIG)
        }
    } catch (err) {
        setGHRestStatus(REST_STATUS.FAILED)
        error(`[Tauri Runtime Error - http client]: ${err}`)
        return
    }
}
