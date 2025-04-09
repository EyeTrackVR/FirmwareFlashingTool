import { NetworkManagement } from '@pages/NetworkManagement'
import { useNavigate } from '@solidjs/router'
import { staticMdns } from '@src/static'
import { useAppAPIContext } from '@store/context/api'

export const ManageNetwork = () => {
    const navigate = useNavigate()
    const { ssid, password, setNetwork, mdns } = useAppAPIContext()

    return (
        <NetworkManagement
            ssid={ssid()}
            mdns={mdns()}
            password={password()}
            onClickSkip={() => {
                navigate('/configureBoardWizard')
            }}
            onSubmit={(ssid, password, trackerName) => {
                const mdns = !trackerName ? staticMdns : trackerName
                setNetwork(ssid, password, mdns)
                navigate('/flashFirmware')
            }}
        />
    )
}

export default ManageNetwork
