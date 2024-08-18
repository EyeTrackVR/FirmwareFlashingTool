import { createMemo } from 'solid-js'
import Homepage from '@pages/Homepage/Index'
import { useAppUIContext } from '@store/context/ui'

const Index = () => {
    const { setOpenModal } = useAppUIContext()

    //mock data
    const camera = createMemo(() => {
        return {
            isConnected: true,
            active: false,
            isUSB: true,
            cameraName: 'Camera 1',
            port: 'Com1',
        }
    })

    return (
        <Homepage
            cameras={[camera(), camera()]}
            onClickCameraRotation={() => {}}
            onClickCroppingMode={() => {}}
            onClickOpenModal={(type) => {
                setOpenModal({ open: true, type })
            }}
        />
    )
}

export default Index
