import { appLogDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/api/shell'
import Button from '..'

export const ConfigButton = () => {
    const handleConfigDir = () => {
        appLogDir().then((dir) => {
            console.log(dir)
            open(dir).then(() => console.log('opened'))
        })
    }
    return (
        <Button
            color="#f44336"
            shadow="0 0 10px #f44336"
            text="Open Logs"
            onClick={handleConfigDir}
        />
    )
}
