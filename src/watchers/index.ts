import { watchAppVersion } from './watchAppVersion'
import { watchDOMContent } from './watchDOMContent'
import { watchGHRequest } from './watchGHRequest'
import { watchSettings } from './watchSettings'

export const runWatchers = () => {
    watchAppVersion()
    watchGHRequest()
    watchDOMContent()
    watchSettings()
}
