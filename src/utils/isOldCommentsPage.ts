export function isOldCommentsPage(): boolean {
    if (!/reddit.com\/r\/\w+\/comments/.test(window.location.href)) {
        console.info(__NAME__, 'isOldCommentsPage', 'Not on comments page')
        return false
    }

    if (document.querySelector('html')?.classList.contains('theme-beta')) {
        console.info(__NAME__, 'isOldCommentsPage', 'Not on old theme')
        return false
    }

    return true
}
