import Typography from '@components/Typography'
import { Component } from 'solid-js'

export interface IProps {
    version: string
    board: string
}

const Firmware: Component<IProps> = (props) => {
    return (
        <div class="flex w-full gap-6 select-none">
            <Typography color="white" text="body">
                {props.version} {`${!props.board.trim() ? '' : `| ${props.board}`}`}
            </Typography>
        </div>
    )
}

export default Firmware
