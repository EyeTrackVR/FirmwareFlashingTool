import { ConfigButton } from '@components/ConfigButton'

const DevTools = () => {
    return (
        <div class="flex flex-col justify-center items-center">
            <h1 class="text-lg">Tools</h1>
            <hr class="divider" />
            <br />
            {/* <DebugMode /> */}
            <br />
            <hr class="divider" />
            <br />
            <ConfigButton />
            <br />
            <hr class="divider" />
        </div>
    )
}

export default DevTools
