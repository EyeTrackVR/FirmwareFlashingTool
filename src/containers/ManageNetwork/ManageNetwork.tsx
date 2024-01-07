import { useNavigate } from '@solidjs/router'
import { NetworkManagement } from '@pages/NetworkManagement/NetworkManagement'
import { useAppAPIContext } from '@store/context/api'

export const ManageNetwork = () => {
    const navigate = useNavigate()
    const { ssid, password, setNetwork } = useAppAPIContext()

    const { loader } = useAppAPIContext()

    return (
        <NetworkManagement
            isLoading={loader()}
            ssid={ssid()}
            password={password()}
            onClickSkip={() => {
                navigate('/')
            }}
            onSubmit={(ssid, password) => {
                if (loader()) return
                setNetwork(ssid, password)
                navigate('/flashFirmware')
            }}
        />
    )
}

export default ManageNetwork
