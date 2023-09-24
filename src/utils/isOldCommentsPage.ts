export function isOldCommentsPage(): boolean {
    if (!/reddit.com\/r\/\w+\/comments/.test(window.location.href)) {
        console.info(DEFINE.NAME, 'isOldCommentsPage', 'Not on comments page')
        return false
    }

    if (document.querySelector('html')?.classList.contains('theme-beta')) {
        console.info(DEFINE.NAME, 'isOldCommentsPage', 'Not on old theme')
        return false
    }

    return true
}
