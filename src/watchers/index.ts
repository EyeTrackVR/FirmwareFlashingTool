import { watchAppVersion } from './watchAppVersion'
import { watchDOMContent } from './watchDOMContent'
import { watchGHRequest } from './watchGHRequest'

export const runWatchers = () => {
    watchAppVersion()
    watchGHRequest()
    watchDOMContent()
}
