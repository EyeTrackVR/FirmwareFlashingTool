import Typography from '@components/Typography'
import { IconTypes } from 'solid-icons'
import { ParentComponent } from 'solid-js'

export interface IProps {
    icon: IconTypes
    iconColor: string
    label: string
    description: string
}

const ContextWrapper: ParentComponent<IProps> = (props) => {
    return (
        <section class="flex flex-col gap-24 bg-black-900 p-24 rounded-12 border border-solid border-black-800 w-full">
            <div class="flex gap-12 items-center w-full">
                <div class="bg-purple-300 rounded-md flex p-6 rounded-6">
                    <props.icon size={24} color={props.iconColor} />
                </div>
                <Typography color="white" text="body">
                    {props.label}
                </Typography>
            </div>
            <div class="text-left">
                <Typography color="white" text="caption">
                    {props.description}
                </Typography>
            </div>
            {props.children}
        </section>
    )
}

export default ContextWrapper
