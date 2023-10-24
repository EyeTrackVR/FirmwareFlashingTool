import { onMount, Suspense } from 'solid-js'
import WebSerial from '@components/webserial'
import { useAppContextMain } from '@store/context/main'

const App = () => {
    const { handleTitlebar } = useAppContextMain()

    onMount(() => {
        handleTitlebar()
    })

    return (
        <div class="w-[100%] h-[100%]">
            <Suspense>
                <WebSerial />
            </Suspense>
        </div>
    )
}

export default App
