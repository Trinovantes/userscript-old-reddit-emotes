import { getLogger } from './getLogger'
import type { EmoteComment } from './EmoteComment'
import type { EmoteMeta } from './EmoteMeta'
import type { RedditCommentResponse } from './Reddit'

const { logInfo, logWarn } = getLogger('fetchEmotes')

export async function fetchEmotes(comments: Array<EmoteComment>): Promise<Array<EmoteMeta>> {
    const urls = uniqueEmoteComments(comments)

    logInfo('Fetching', urls)
    const requests = urls.map((url) => new Promise<Array<EmoteMeta>>((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url,
            onload: (res) => {
                try {
                    const response = JSON.parse(res.responseText) as RedditCommentResponse
                    const subredditName = response[1].data.children[0].data.subreddit
                    const emotes = new Array<EmoteMeta>()

                    for (const emote of Object.values(response[1].data.children[0].data.media_metadata)) {
                        const matches = /emote\|t5_\w+\|(\d+)/.exec(emote.id)
                        if (!matches) {
                            continue
                        }

                        emotes.push({
                            name: emote.id,
                            id: matches[1],
                            subredditName,
                            url: emote.s.u,
                        })
                    }

                    resolve(emotes)
                } catch (err) {
                    logWarn('Failed to parse Reddit API response', err)
                    reject(err)
                }
            },
            onerror: (errorResponse) => {
                const msg = `Failed to fetch Reddit API (${errorResponse.status} ${errorResponse.statusText}): ${errorResponse.responseText}`
                logWarn(msg)
                reject(new Error(msg))
            },
        })
    }))

    return (await Promise.all(requests)).flat()
}

function uniqueEmoteComments(comments: Array<EmoteComment>): Array<string> {
    const emotes = new Set<string>()
    const urls = new Set<string>()

    for (const comment of comments) {
        for (const wrappedEmote of comment.wrappedEmotes) {
            if (emotes.has(wrappedEmote)) {
                continue
            }

            emotes.add(wrappedEmote)
            urls.add(new URL(`${comment.permalink}.json`, 'https://www.reddit.com').href)
        }
    }

    return [...urls]
}
