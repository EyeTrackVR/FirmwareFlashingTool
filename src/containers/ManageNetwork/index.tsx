import { NetworkManagement } from '@pages/NetworkManagement'
import { useNavigate } from '@solidjs/router'
import { staticMdns } from '@src/static'
import { useAppAPIContext } from '@store/context/api'

export const ManageNetwork = () => {
    const navigate = useNavigate()
    const { ssid, password, setNetwork, mdns } = useAppAPIContext()
    const { loader } = useAppAPIContext()

    return (
        <NetworkManagement
            isLoading={loader()}
            ssid={ssid()}
            mdns={mdns()}
            password={password()}
            onClickSkip={() => {
                navigate('/')
            }}
            onSubmit={(ssid, password, trackerName) => {
                if (loader()) return
                const mdns = !trackerName ? staticMdns : trackerName
                setNetwork(ssid, password, mdns)
                navigate('/flashFirmware')
            }}
        />
    )
}

export default ManageNetwork
