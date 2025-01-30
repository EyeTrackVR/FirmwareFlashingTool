import Typography from '@components/Typography'
import theme from '@src/common/theme'
import { ImBooks } from 'solid-icons/im'
import { TbTerminal2 } from 'solid-icons/tb'
import { Component } from 'solid-js'

export interface IProps {
    onClickOpenDocs: () => void
}

const TerminalHeader: Component<IProps> = (props) => {
    return (
        <div class="flex justify-between">
            <div class="flex gap-12 justify-center items-center">
                <TbTerminal2 size={24} color={theme.colors.white[100]} />
                <Typography color="white" text="h3">
                    Serial Terminal
                </Typography>
            </div>
            <div
                class="cursor-pointer"
                onClick={() => {
                    props.onClickOpenDocs()
                }}>
                <ImBooks size={24} color={theme.colors.blue[100]} />
            </div>
        </div>
    )
}

export default TerminalHeader
