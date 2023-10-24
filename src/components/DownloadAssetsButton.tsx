import { FaSolidDownload } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import CustomButton from '@components/CustomButton'

const DownloadAssetsButton = () => {
    const [isButtonActive, setIsButtonActive] = createSignal(false)

    const handleConfigDir = () => {}
    return (
        <CustomButton
            isButtonActive={isButtonActive()}
            tooltip="Download Firmware Assets"
            icon={<FaSolidDownload size={45} fill="#FFFFFFe3" />}
            onClick={() => {
                setIsButtonActive(!isButtonActive())
                handleConfigDir()
            }}
        />
    )
}

export default DownloadAssetsButton
