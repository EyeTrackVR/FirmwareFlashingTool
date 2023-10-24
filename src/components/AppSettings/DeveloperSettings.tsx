import DownloadAssetsButton from '@components/DownloadAssetsButton'
import EraseButton from '@components/EraseButton'
import OpenDocs from '@components/OpenDocs'
import FirmwareList from '@components/Selection/FirmwareList'
import WebSerial from '@components/WebSerial'

const FlashSettings = () => {
    return (
        <div class="flex grow rounded-xl flex-col pl-4 pr-4 pb-4 pt-4 bg-[#333742]">
            <div>
                <div class="pb-6 pl-3 pr-3">
                    <p class="text-start text-2xl">Flash Settings</p>
                </div>
            </div>
            <div class="flex justify-evenly flex-wrap items-center gap-3">
                <div>
                    <DownloadAssetsButton />
                </div>
                <div>
                    <WebSerial />
                </div>
                <div>
                    <OpenDocs />
                </div>
                <div>
                    <EraseButton />
                </div>
            </div>
        </div>
    )
}
export default FlashSettings
