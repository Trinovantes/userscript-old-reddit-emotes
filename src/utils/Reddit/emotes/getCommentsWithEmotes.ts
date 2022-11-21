import { getLogger } from '../../getLogger'
import type { RedditComment } from '../RedditComment'

const { logWarn } = getLogger('getCommentsWithEmotes')

export function getCommentsWithEmotes(): Array<RedditComment> {
    const commentsWithMedia = new Array<RedditComment>()
    const $commentNodes = $('.comment')

    for (const commentNode of $commentNodes) {
        if ($(commentNode).hasClass('collapsed')) {
            continue
        }
        if ($(commentNode).hasClass('deleted')) {
            continue
        }

        const permalink = $(commentNode).attr('data-permalink')
        if (!permalink) {
            logWarn('Failed to get permalink', commentNode)
            continue
        }

        const subredditName = $(commentNode).attr('data-subreddit-fullname')
        if (!subredditName?.startsWith('t5_')) {
            logWarn('Failed to get subredditName', commentNode)
            continue
        }

        const commentName = $(commentNode).attr('data-fullname')
        if (!commentName) {
            logWarn('Failed to get commentName', commentNode)
            continue
        }

        const $textNodes = $(commentNode).find('.entry .md-container') // May have multiple matches if it's nested comments
        const $textNode = $textNodes.filter((idx, el) => $(el).siblings('input[name=thing_id]').val() === commentName).find('> .md')
        if ($textNode.length !== 1) {
            logWarn('Failed to get $textNode', commentNode)
            continue
        }

        const emoteMatches = [...$textNode.text().matchAll(/:\d+:/g)]
        const wrappedEmotes = emoteMatches.map((match) => match[0])

        commentsWithMedia.push({
            commentName,
            permalink,
            subredditName,
            $textNode,
            wrappedEmotes,
        })
    }

    return commentsWithMedia
}
