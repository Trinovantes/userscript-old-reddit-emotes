export function isCommentsPage(): boolean {
    return /reddit.com\/r\/\w+\/comments/.test(window.location.href)
}
