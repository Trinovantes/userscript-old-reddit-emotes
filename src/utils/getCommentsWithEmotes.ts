import { getLogger } from './getLogger'
import type { EmoteComment } from './EmoteComment'

const { logWarn } = getLogger('getCommentsWithEmotes')

export function getCommentsWithEmotes(): Array<EmoteComment> {
    const commentsWithEmotes: Array<EmoteComment> = []
    const $commentNodes = $('.comment')

    for (const commentNode of $commentNodes) {
        const permalink = $(commentNode).attr('data-permalink')
        if (!permalink) {
            logWarn('Failed to get permalink', commentNode)
            continue
        }

        const subredditName = $(commentNode).attr('data-subreddit-fullname')
        if (!subredditName?.startsWith('t5_')) {
            logWarn('Failed to get subredditId', commentNode)
            continue
        }

        const commentId = $(commentNode).attr('data-fullname')
        if (!commentId) {
            logWarn('Failed to get commentId', commentNode)
            continue
        }

        const $textNodes = $(commentNode).find('.entry .md-container') // May have multiple matches if it's nested comments
        const $textNode = $textNodes.filter((idx, el) => $(el).siblings('input[name=thing_id]').val() === commentId).find('.md')
        if ($textNode.length !== 1) {
            logWarn('Failed to get $textNode', commentNode)
            continue
        }

        const matches = [...$textNode.text().matchAll(/:\d+:/g)]
        if (matches.length === 0) {
            continue
        }

        const wrappedEmotes = matches.map((match) => match[0])
        commentsWithEmotes.push({
            permalink,
            subredditName,
            $textNode,
            wrappedEmotes,
        })
    }

    return commentsWithEmotes
}
