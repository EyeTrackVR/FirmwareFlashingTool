import FirmwareList from '@components/Selection/FirmwareList'

const FlashFirmware = () => {
    return (
        <div
            id="custom-context-menu"
            class="flex grow rounded-xl flex-col pl-4 pr-4 pb-4 pt-4 bg-[#333742]">
            <FirmwareList />
        </div>
    )
}

export default FlashFirmware
