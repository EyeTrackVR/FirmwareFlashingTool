import { useNavigate } from '@solidjs/router'
import { NAVIGATION } from '@interfaces/enums'
import { NetworkManagement } from '@pages/NetworkManagement/NetworkManagement'
import { STATIC_MNDS_NAME } from '@src/static'
import { useAppAPIContext } from '@store/api/api'

export const ManageNetwork = () => {
    const navigate = useNavigate()
    const { ssid, password, setNetwork, mdns, loader } = useAppAPIContext()

    return (
        <NetworkManagement
            isLoading={loader()}
            ssid={ssid()}
            mdns={mdns()}
            password={password()}
            onClickSkip={() => {
                navigate(NAVIGATION.CONFIGURE_BOARD)
            }}
            onSubmit={(ssid, password, trackerName) => {
                if (loader()) return
                const mdns = !trackerName ? STATIC_MNDS_NAME : trackerName
                setNetwork(ssid, password, mdns)
                navigate(NAVIGATION.FLASH_FIRMWARE)
            }}
        />
    )
}

export default ManageNetwork
