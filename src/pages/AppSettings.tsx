import DeveloperSettings from '@components/AppSettings/DeveloperSettings'
import FlashFirmware from '@components/AppSettings/FlashFirmware'
import NetworkSettings from '@components/AppSettings/NetworkSettings'
//import DeviceConfig from '@components/AppSettings/DeviceConfig'

const AppSettingsPage = () => {
    return (
        <div class="flex justify-center items-center content-center flex-col pt-[100px] text-white">
            <div class="w-full flex justify-center align-center flex-col items-center max-w-[1200px]">
                <div class="w-full pb-12">
                    <FlashFirmware />
                </div>
                <div class="w-full pb-12">
                    <DeveloperSettings />
                </div>
                <div class="w-full pb-12">
                    <NetworkSettings />
                </div>
                {/* <div class="w-full pb-12">
                    <DeviceConfig />
                </div> */}
            </div>
        </div>
    )
}

export default AppSettingsPage
