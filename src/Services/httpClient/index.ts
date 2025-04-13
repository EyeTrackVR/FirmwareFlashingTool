import { type Client, getClient } from '@tauri-apps/api/http'

let _client: Client | undefined = undefined

export const initializeHttpClient = async (): Promise<Client> => {
    if (_client) return _client
    const client = await getClient()

    _client = client
    return _client
}
