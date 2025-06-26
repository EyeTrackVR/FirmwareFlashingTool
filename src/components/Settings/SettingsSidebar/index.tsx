import Typography from '@components/Typography'
import { Component, createMemo } from 'solid-js'
import MenuItem from '../SettingsMenuItem'
import SettingsSection from '../SettingsSection'
export interface IProps {
    onClick: (route: string) => void
    navigation: string
}

const SettingsSidebar: Component<IProps> = (props) => {
    const settingsConfig = createMemo(() => [
        {
            title: 'General settings',
            items: [{ path: '/generalSettings', label: 'Settings' }],
        },
        {
            title: 'Algorithm settings',
            items: [
                { path: '/algorithmTrackingSettings', label: 'Tracking algorithms' },
                { path: '/AlgorithmSelectionSettings', label: 'Algorithms order' },
            ],
        },
        {
            title: 'OSC settings',
            items: [{ path: '/oscSettings', label: 'OSC' }],
        },
        {
            title: 'VRCFT module settings',
            items: [{ path: '/vrcftSettings', label: 'VRCFT module settings' }],
        },
    ])

    return (
        <section class="min-w-[280px] mr-24 mb-12 mt-8 ml-8 flex flex-col gap-24">
            <div class="flex h-full flex-col px-[20px] py-[20px] overflow-y-auto bg-black-900 border border-solid border-black-800 rounded-12 gap-24">
                <Typography color="white" text="body" class="text-left">
                    Settings
                </Typography>
                <div class="flex flex-col h-full justify-between">
                    <div class="flex flex-col gap-12">
                        {settingsConfig().map((section) => (
                            <SettingsSection
                                title={section.title}
                                items={section.items}
                                navigation={props.navigation}
                                onClick={(path) => props.onClick(path)}
                            />
                        ))}
                    </div>
                    <MenuItem
                        onClick={() => props.onClick('/dashboard')}
                        label="Back"
                        isActive={false}
                    />
                </div>
            </div>
        </section>
    )
}
export default SettingsSidebar
