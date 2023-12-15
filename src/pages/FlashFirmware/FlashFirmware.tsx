import DeveloperSettings from '@components/AppSettings/DeveloperSettings'

const AppSettingsPage = () => {
    return (
        <div class="flex justify-center items-center content-center flex-col pt-[100px] text-white">
            <div class="w-full flex justify-center align-center flex-col items-center max-w-[1200px]">
                <div class="w-full pb-12">
                    <DeveloperSettings />
                </div>
            </div>
        </div>
    )
}

export default AppSettingsPage
