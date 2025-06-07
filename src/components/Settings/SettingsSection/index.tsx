import Typography from '@components/Typography'
import { Component } from 'solid-js'
import MenuItem from '../SettingsMenuItem'

export interface IItems {
    path: string
    label: string
}

export interface IProps {
    onClick: (path: string) => void
    navigation: string
    title: string
    items: IItems[]
}

const SettingsSection: Component<IProps> = (props) => (
    <div class="flex flex-col gap-12">
        <Typography color="white" text="caption" class="text-left font-[600]">
            {props.title}
        </Typography>
        <div class="flex flex-col gap-12">
            {props.items.map((item) => (
                <MenuItem
                    onClick={() => {
                        props.onClick(item.path)
                    }}
                    label={item.label}
                    isActive={props.navigation === item.path}
                />
            ))}
        </div>
    </div>
)

export default SettingsSection
