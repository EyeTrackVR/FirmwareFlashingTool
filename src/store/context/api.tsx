import { removeFile, readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { getClient, ResponseType } from '@tauri-apps/api/http'
import { appConfigDir, join } from '@tauri-apps/api/path'
import { invoke, convertFileSrc } from '@tauri-apps/api/tauri'
import { pipe } from 'fp-ts/lib/function'
import { createContext, useContext, createMemo, type Component, Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { debug, error, warn, trace } from 'tauri-plugin-log-api'
import { download, upload } from 'tauri-plugin-upload-api'
import { useAppNotificationsContext } from './notifications'
import type { Context } from '@static/types'
import {
    ENotificationType,
    RESTStatus,
    RESTType,
    ESPEndpoints,
    CHANNEL_TYPE,
} from '@interfaces/enums'
import { AppStoreAPI, IEndpoint, IGHAsset, IGHRelease, IGHResponse } from '@interfaces/interfaces'
import { GHEndpoints } from '@src/static/endpoints'
import { O } from '@static/types'
import { makeRequest } from 'tauri-plugin-request-client'

interface AppAPIContext {
    //********************************* gh rest *************************************/
    getGHRestStatus: Accessor<RESTStatus>
    getFirmwareAssets: Accessor<IGHAsset[]>
    getFirmwareVersion: Accessor<string>
    getFirmwareType: Accessor<string>
    setGHRestStatus: (status: RESTStatus) => void
    setFirmwareAssets: (assets: IGHAsset) => void
    setFirmwareVersion: (version: string) => void
    setFirmwareType: (type: string) => void
    setLoader: (loader: boolean) => void
    activeBoard: Accessor<string>
    //********************************* rest *************************************/
    getRESTStatus: Accessor<RESTStatus>
    getRESTDevice: Accessor<string>
    getRESTResponse: Accessor<object>
    loader: Accessor<boolean>
    ssid: Accessor<string>
    apModeStatus: Accessor<boolean>
    password: Accessor<string>
    mdns: Accessor<string>
    channelMode: Accessor<CHANNEL_TYPE>
    setRESTStatus: (status: RESTStatus) => void
    setRESTDevice: (device: string) => void
    setRESTResponse: (response: object) => void
    //********************************* endpoints *************************************/
    getEndpoints: Accessor<Map<string, IEndpoint>>
    getEndpoint: (key: string) => IEndpoint
    //********************************* hooks *************************************/
    downloadAsset: (firmware: string) => Promise<void>
    doGHRequest: (channelType: CHANNEL_TYPE) => Promise<void>
    useRequestHook: (endpointName: string, deviceName?: string, args?: string) => Promise<boolean>
    useOTA: (firmwareName: string, device: string) => Promise<void>
    setActiveBoard: (board: string) => void
    setNetwork: (ssid: string, password: string, mdns: string) => void
    setChannelMode: (channel: CHANNEL_TYPE) => void
    setAPModeStatus: (status: boolean) => void
}

const AppAPIContext = createContext<AppAPIContext>()
export const AppAPIProvider: Component<Context> = (props) => {
    const { addNotification } = useAppNotificationsContext()

    // TODO: Use backend api schema to generate endpoints map and use that instead of hardcoding the endpoints
    const endpointsMap: Map<string, IEndpoint> = new Map<string, IEndpoint>([
        //* ESP Specific Endpoints */
        ['ota', { url: `:81${ESPEndpoints.OTA}`, type: RESTType.POST }],
        ['ping', { url: `:81${ESPEndpoints.PING}`, type: RESTType.GET }],
        ['save', { url: `:81${ESPEndpoints.SAVE}`, type: RESTType.GET }],
        ['wifi', { url: `:81${ESPEndpoints.WIFI}`, type: RESTType.POST }],
        ['setDevice', { url: `:81${ESPEndpoints.SET_DEVICE}`, type: RESTType.POST }],
        ['setTxPower', { url: `:81${ESPEndpoints.SET_TX_POWER}`, type: RESTType.POST }],
        ['resetConfig', { url: `:81${ESPEndpoints.RESET_CONFIG}`, type: RESTType.GET }],
        ['rebootDevice', { url: `:81${ESPEndpoints.REBOOT_DEVICE}`, type: RESTType.GET }],
        ['wifiStrength', { url: `:81${ESPEndpoints.WIFI_STRENGTH}`, type: RESTType.POST }],
        ['restartCamera', { url: `:81${ESPEndpoints.RESTART_CAMERA}`, type: RESTType.GET }],
        ['getStoredConfig', { url: `:81${ESPEndpoints.GET_STORED_CONFIG}`, type: RESTType.GET }],
    ])

    const defaultState: AppStoreAPI = {
        activeBoard: '',
        channelMode: CHANNEL_TYPE.OFFICIAL,
        restAPI: {
            status: RESTStatus.COMPLETE,
            device: '',
            response: {},
        },
        ghAPI: {
            status: RESTStatus.COMPLETE,
            assets: [],
            version: '',
        },
        ssid: '',
        password: '',
        firmwareType: '',
        loader: false,
        apModeStatus: false,
        mdns: '',
    }

    const [state, setState] = createStore<AppStoreAPI>(defaultState)
    const apiState = createMemo(() => state)

    // TODO:  Migrate all github related functions to the rust backend
    //********************************* gh rest *************************************/
    //#region gh rest

    const setLoader = (loader: boolean) => {
        setState(
            produce((s) => {
                s.loader = loader
            }),
        )
    }
    const setGHRestStatus = (status: RESTStatus) => {
        setState(
            produce((s) => {
                s.ghAPI.status = status
            }),
        )
    }

    const setChannelMode = (channel: CHANNEL_TYPE) => {
        setState(
            produce((s) => {
                s.channelMode = channel
            }),
        )
    }

    const clearGHApiState = () => {
        setState(
            produce((s) => {
                s.ghAPI.assets = []
                s.ghAPI.assets = []
                s.ghAPI.version = ''
                s.activeBoard = ''
            }),
        )
    }

    const setFirmwareAssets = (assets: IGHAsset) => {
        setState(
            produce((s) => {
                s.ghAPI.assets.push(assets)
            }),
        )
    }
    const setFirmwareVersion = (version: string) => {
        setState(
            produce((s) => {
                s.ghAPI.version = version
            }),
        )
    }

    const setFirmwareType = (type: string) => {
        setState(
            produce((s) => {
                s.firmwareType = type
            }),
        )
    }
    const setActiveBoard = (activeBoard: string) => {
        setState(
            produce((s) => {
                s.activeBoard = activeBoard
            }),
        )
    }
    const setNetwork = (ssid: string, password: string, mdns: string) => {
        setState(
            produce((s) => {
                s.ssid = ssid
                s.password = password
                s.mdns = mdns
            }),
        )
    }

    const setAPModeStatus = (status: boolean) => {
        setState(
            produce((s) => {
                s.apModeStatus = status
            }),
        )
    }

    const getGHRestStatus = createMemo(() => apiState().ghAPI.status)
    const getFirmwareAssets = createMemo(() => apiState().ghAPI.assets)
    const getFirmwareVersion = createMemo(() => apiState().ghAPI.version)
    const getFirmwareType = createMemo(() => apiState().firmwareType)
    const loader = createMemo(() => apiState().loader)
    const mdns = createMemo(() => apiState().mdns)
    const channelMode = createMemo(() => apiState().channelMode)
    const apModeStatus = createMemo(() => apiState().apModeStatus)

    //#endregion
    //********************************* rest *************************************/
    //#region rest
    const setRESTStatus = (status: RESTStatus) => {
        setState(
            produce((s) => {
                s.restAPI.status = status
            }),
        )
    }
    const setRESTDevice = (device: string) => {
        setState(
            produce((s) => {
                s.restAPI.device = device
            }),
        )
    }
    const setRESTResponse = (response: object) => {
        setState(
            produce((s) => {
                s.restAPI.response = response
            }),
        )
    }
    const activeBoard = createMemo(() => apiState().activeBoard)
    const getRESTStatus = createMemo(() => apiState().restAPI.status)
    const getRESTDevice = createMemo(() => apiState().restAPI.device)
    const getRESTResponse = createMemo(() => apiState().restAPI.response)
    const ssid = createMemo(() => apiState().ssid)
    const password = createMemo(() => apiState().password)
    const getEndpoints = createMemo(() => endpointsMap)
    const getEndpoint = (key: string) =>
        pipe(
            O.fromNullable(endpointsMap.get(key)),
            O.match(
                () => {
                    error(`[Endpoints]: Endpoint ${key} does not exist`)
                    return {
                        url: '',
                        type: RESTType.GET,
                    }
                },
                (endpoint) => endpoint,
            ),
        )
    //#endregion

    //#region hooks
    const getRelease = async (firmware: string) => {
        const appConfigDirPath = await appConfigDir()
        if (firmware === '' || firmware.length === 0) {
            debug('[Github Release]: No firmware selected')
            throw new Error('A firmware must be selected before downloading')
        }

        trace(`[Github Release]: App Config Dir: ${appConfigDirPath}`)

        // check if the firmware chosen matches the one names in the firmwareAssets array of objects
        const firmwareAsset = getFirmwareAssets().find((asset) => asset.name === firmware)

        trace(`[Github Release]: Firmware Asset: ${firmwareAsset}`)

        if (firmwareAsset) {
            debug(`[Github Release]: Downloading firmware: ${firmware}`)
            debug(`[Github Release]: Firmware URL: ${firmwareAsset}`)

            // parse out the file name from the firmwareAsset.url and append it to the appConfigDirPath
            const fileName =
                firmwareAsset.browser_download_url.split('/')[
                    firmwareAsset.browser_download_url.split('/').length - 1
                ]

            const path = await join(appConfigDirPath, fileName)
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
                targetDir: appConfigDirPath,
            })
            await removeFile(path)

            debug(`[Github Release]: Unzip Response: ${res}`)

            const manifest = await readTextFile('manifest.json', { dir: BaseDirectory.AppConfig })

            const config_json = JSON.parse(manifest)

            if (manifest !== '') {
                // modify the version property
                config_json['version'] = getFirmwareVersion()
                // loop through the builds array and the parts array and update the path property
                for (let i = 0; i < config_json['builds'].length; i++) {
                    for (let j = 0; j < config_json['builds'][i]['parts'].length; j++) {
                        const firmwarePath = await join(
                            appConfigDirPath,
                            config_json['builds'][i]['parts'][j]['path'],
                        )
                        debug(`[Github Release]: Firmware Path: ${firmwarePath}`)
                        const firmwareSrc = convertFileSrc(firmwarePath)
                        debug(`[Github Release]: Firmware Src: ${firmwareSrc}`)
                        config_json['builds'][i]['parts'][j]['path'] = firmwareSrc
                    }
                }

                // write the config file
                writeTextFile('manifest.json', JSON.stringify(config_json), {
                    dir: BaseDirectory.AppConfig,
                })
                    .then(() => {
                        debug('[Manifest Updated]: Manifest Updated Successfully')
                    })
                    .finally(() => {
                        debug('[Manifest Updated]: Finished')
                    })
                    .catch((err) => {
                        error(`[Manifest Update Error]: ${err}`)
                    })

                debug('[Github Release]: Manifest: ', config_json)
                return
            }
        } else {
            throw new Error('Selected board is not supported')
        }
    }

    /**
     * @description A hook that will return the data from the github release endpoint and a function that will download the asset from the github release endpoint
     * @returns  {Promise<void>} data - The data returned from the github release endpoint
     * @returns  {function} downloadAsset - The function that will download the asset from the github release endpoint
     */
    const downloadAsset = async (firmware: string): Promise<void> => {
        const response = await getRelease(firmware)
        debug(`[Github Release]: Download Response: ${response}`)
    }

    // TODO: Implement a way to read if the merged-firmware.bin file and manifest.json file exists in the app config directory and if it does, then use that instead of downloading the firmware from github
    // Note: If both files are present, we should early return and set a UI store value that will be used to display a message to the user that they can use the firmware that is already downloaded and show an optional button to erase the firmware

    //TODO: Add notifications to all the debug statements

    const setGHData = (data: IGHRelease, update: boolean) => {
        if (data['name'] === undefined) {
            setFirmwareVersion(data['version'])
        } else {
            setFirmwareVersion(data['name'])
        }
        trace(`[Github Response Data]: ${JSON.stringify(data)}`)
        const assets: Array<{
            browser_download_url: string
            name: string
        }> = data['assets']
        const download_urls = assets.map(
            (asset: { browser_download_url: string }) => asset.browser_download_url,
        )

        const firmware_assets = assets.map((asset: { name: string }) => asset.name)

        // split the firmware_assets array of strings on the first dash and return the first element of the array
        const boardName = firmware_assets.map((asset: string) => asset.split('-')[0])

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
                    version: getFirmwareVersion(),
                    assets: getFirmwareAssets(),
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

    /**
     * @description Invoke the do_gh_request command
     * @function doGHRequest
     * @async
     * @export
     * @note This function will call the github repo REST API release endpoint and update/create a config.json file with the latest release data
     * @note This function will write the file to the app config directory C:\Users\<User>\AppData\Roaming\com.eyetrackvr.dev\config.json
     * @note Should be called on app start
     * @example
     * import { doGHRequest } from './github'
     * doGHRequest('Official')
     * .then(() => debug('Request sent'))
     * .catch((err) => error(err))
     */

    const doGHRequest = async (channelType: CHANNEL_TYPE) => {
        try {
            clearGHApiState()
            const client = await getClient()
            const endpoint = GHEndpoints[channelType]

            setGHRestStatus(RESTStatus.ACTIVE)
            setGHRestStatus(RESTStatus.LOADING)

            debug(`[Github Release]: Github Endpoint ${endpoint}`)

            try {
                const githubResponse = await client.get<IGHResponse>(endpoint, {
                    timeout: 30,
                    // the expected response type
                    headers: {
                        'User-Agent': 'EyeTrackVR',
                    },
                    responseType: ResponseType.JSON,
                })

                let response: IGHResponse

                if (!Array.isArray(githubResponse.data)) {
                    response = githubResponse
                } else {
                    const preReleases = githubResponse.data.filter(({ prerelease }) => prerelease)
                    response = {
                        ...githubResponse,
                        data: { ...preReleases[0] },
                    }
                }

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
                        setGHRestStatus(RESTStatus.COMPLETE)
                        return
                    }
                    if (response.data['name'] === config_json.version) {
                        debug('[Config Exists]: Config Exists and is up to date')
                        setGHData(response.data, false)
                        return
                    }

                    // update config
                    setGHData(response.data, true)
                    debug('[Config Exists]: Config Exists and is out of date - Updating')
                    setGHRestStatus(RESTStatus.COMPLETE)
                    return
                } catch (err) {
                    setGHRestStatus(RESTStatus.NO_CONFIG)
                    if (response.ok) {
                        error(`[Config Read Error]: ${err} Creating config.json`)
                        setGHData(response.data, true)
                        setGHRestStatus(RESTStatus.COMPLETE)
                    }
                }
            } catch (err) {
                setGHRestStatus(RESTStatus.FAILED)
                error(`[Github Release Error]: ${err}`)
                const config = await readTextFile('config.json', {
                    dir: BaseDirectory.AppConfig,
                })
                if (!config) {
                    setGHRestStatus(RESTStatus.NO_CONFIG)
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
                setGHRestStatus(RESTStatus.NO_CONFIG)
                // check if the error is a rate limit error
                /* if (err instanceof Object) {
                            if (err.response instanceof Object) {
                                if (err.response.status === 403) {
                                    // rate limit error
                                    // check if the rate limit reset time is in the future
                                    // if it is, set the rate limit reset time
                                    // if it isn't, set the rate limit reset time to 0
                                    const rate_limit_reset = err.response.headers['x-ratelimit-reset']
                                    const rate_limit_reset_time = new Date(rate_limit_reset * 1000)
                                    const now = new Date()
                                    if (rate_limit_reset_time > now) {
                                        setRateLimitReset(rate_limit_reset_time)
                                        return
                                    }
                                    setRateLimitReset(new Date(0))
                                }
                            }
                        } */
            }
        } catch (err) {
            setGHRestStatus(RESTStatus.FAILED)
            error(`[Tauri Runtime Error - http client]: ${err}`)
            return
        }
    }

    const useRequestHook = async (
        endpointName: string,
        deviceName?: string,
        args?: string,
    ): Promise<boolean> => {
        let endpoint: string = getEndpoint(endpointName)!.url
        const method: RESTType = getEndpoint(endpointName)!.type

        if (typeof deviceName != 'undefined') {
            deviceName = 'http://' + deviceName
        } else {
            deviceName = 'http://localhost'
        }

        // TODO: add device context to the store
        /* const device = getDevices().find((device) => device.address === deviceName)
        if (!device) {
            const msg = 'No Device found at that address'
            debug(msg)
            addNotification({
                title: 'Error',
                message: msg,
                type: ENotificationType.ERROR,
            })
            return false
        } */

        if (args) {
            endpoint += args
        }
        setRESTStatus(RESTStatus.LOADING)

        try {
            console.log('[RequestHook]: Making request')
            setRESTStatus(RESTStatus.ACTIVE)
            const response = await makeRequest(endpoint, deviceName, method)
            if (response.status === 'error') {
                setRESTStatus(RESTStatus.FAILED)
                error(`[REST Request]: ${response.error}`)
                addNotification({
                    title: 'Error',
                    message: response.error,
                    type: ENotificationType.ERROR,
                })
                return false
            }
            setRESTResponse(response)
            setRESTStatus(RESTStatus.COMPLETE)
            return true
        } catch (err) {
            setRESTStatus(RESTStatus.FAILED)
            error(`[REST Request]: ${err}`)
            return false
        }
    }

    /**
     * @description Uploads a firmware to a device
     * @param firmwareName The name of the firmware file
     * @param device The device to upload the firmware to
     *
     */
    const useOTA = async (firmwareName: string, device: string) => {
        await useRequestHook('ota', device)
        const path = await join(await appConfigDir(), firmwareName + '.bin')
        await upload(device, path)
    }
    //#endregion

    //#region API Provider
    return (
        <AppAPIContext.Provider
            value={{
                ssid,
                password,
                setNetwork,
                setActiveBoard,
                activeBoard,
                getGHRestStatus,
                getFirmwareAssets,
                getFirmwareVersion,
                getFirmwareType,
                getRESTStatus,
                getRESTDevice,
                getRESTResponse,
                getEndpoints,
                getEndpoint,
                setGHRestStatus,
                setFirmwareAssets,
                setFirmwareVersion,
                setFirmwareType,
                setRESTStatus,
                setRESTDevice,
                setRESTResponse,
                downloadAsset,
                doGHRequest,
                useRequestHook,
                useOTA,
                loader,
                setLoader,
                apModeStatus,
                setAPModeStatus,
                channelMode,
                mdns,
                setChannelMode,
            }}>
            {props.children}
        </AppAPIContext.Provider>
    )
    //#endregion
}

export const useAppAPIContext = () => {
    const context = useContext(AppAPIContext)
    if (context === undefined) {
        throw new Error('useAppAPIContext must be used within an AppAPIProvider')
    }
    return context
}
