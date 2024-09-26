import type { RedditComment } from './RedditComment.ts'

export function getCommentsOnPage() {
    const comments = new Array<RedditComment>()

    for (const commentNode of document.querySelectorAll('.comment')) {
        if (commentNode.classList.contains('collapsed')) {
            continue
        }
        if (commentNode.classList.contains('deleted')) {
            continue
        }

        const permalink = commentNode.getAttribute('data-permalink')
        if (!permalink) {
            console.warn('Failed to get permalink', commentNode)
            continue
        }

        const subredditName = commentNode.getAttribute('data-subreddit-fullname')
        if (!subredditName?.startsWith('t5_')) {
            console.warn(__NAME__, 'getCommentsWithEmbeds', 'Failed to get subredditName', commentNode)
            continue
        }

        const commentName = commentNode.getAttribute('data-fullname')
        if (!commentName) {
            console.warn(__NAME__, 'getCommentsWithEmbeds', 'Failed to get commentName', commentNode)
            continue
        }

        const textNode = commentNode.querySelector(`.entry input[value=${commentName}]+.md-container .md`)
        if (!textNode) {
            console.warn(__NAME__, 'getCommentsWithEmbeds', 'Failed to get textNode', commentNode)
            continue
        }

        const wrappedEmotes = [...textNode.textContent?.matchAll(/:\d+:/g) ?? []].map((match) => match[0])
        const hasEmbed = Boolean(textNode.textContent?.includes('<image>'))

        // Only interested in comments with some media
        if (!(hasEmbed || wrappedEmotes.length > 0)) {
            continue
        }

        comments.push({
            commentName,
            permalink,
            subredditName,
            textNode,
            wrappedEmotes,
            hasEmbed,
        })
    }

    return comments
}
