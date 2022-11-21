import { getLogger } from '../getLogger'

const { logInfo } = getLogger('isOldCommentsPage')

export function isOldCommentsPage(): boolean {
    if (!/reddit.com\/r\/\w+\/comments/.test(window.location.href)) {
        logInfo('Not on comments page')
        return false
    }

    if ($('html').hasClass('theme-beta')) {
        logInfo('Not on old theme')
        return false
    }

    return true
}
