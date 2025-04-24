import { ManageNetwork } from '@pages/ManageNetwork'
import { useNavigate } from '@solidjs/router'
import { STATIC_MDNS } from '@src/static'
import { useAppAPIContext } from '@store/context/api'

export const ManageNetworkRoot = () => {
    const navigate = useNavigate()
    const { ssid, password, setNetwork, mdns } = useAppAPIContext()

    return (
        <ManageNetwork
            ssid={ssid()}
            mdns={mdns()}
            password={password()}
            onClickSkip={() => {
                navigate('/configureBoardWizard')
            }}
            onSubmit={(ssid, password, trackerName) => {
                const mdns = !trackerName ? STATIC_MDNS : trackerName
                setNetwork(ssid, password, mdns)
                navigate('/flashFirmware')
            }}
        />
    )
}

export default ManageNetworkRoot
