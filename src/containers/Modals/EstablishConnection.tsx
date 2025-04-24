import { MODAL_TYPE } from '@interfaces/enums'
import EstablishConnection from '@pages/Modals/EstablishConnection'
import { ESTABLISH_CONNECTION_ID } from '@src/static'
import { activeModal, serverStatus } from '@store/ui/selectors'

const EstablishConnectionRoot = () => {
    return (
        <EstablishConnection
            id={ESTABLISH_CONNECTION_ID}
            appVersion="1.7.0"
            connectionStatus={serverStatus()}
            isActive={activeModal().type === MODAL_TYPE.ESTABLISH_CONNECTION}
        />
    )
}

export default EstablishConnectionRoot
