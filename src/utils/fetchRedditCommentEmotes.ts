import type { EmoteMeta } from './EmoteMeta.ts'
import type { RedditComment } from './RedditComment.ts'
import type { RedditCommentResponse } from './RedditCommentResponse.ts'

export async function fetchRedditCommentEmotes(comments: Array<RedditComment>): Promise<Array<EmoteMeta>> {
    const urls = uniqueCommentUrls(comments)
    const emotes = new Array<EmoteMeta>()

    for (const url of urls) {
        console.info(__NAME__, 'fetchRedditCommentEmotes', url)
        const request = new Promise<Array<EmoteMeta>>((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url,
                onload: (res) => {
                    try {
                        const response = JSON.parse(res.responseText) as RedditCommentResponse
                        const commentEmotes = getEmoteMeta(response)
                        resolve(commentEmotes)
                    } catch (err) {
                        console.warn(__NAME__, 'Failed to parse Reddit API response', err)
                        if (err instanceof Error) {
                            reject(err)
                        } else {
                            reject(new Error(`Failed to fetch comment emotes err:${String(err)}`))
                        }
                    }
                },
                onerror: (errorResponse) => {
                    const msg = `Failed to fetch Reddit API (${errorResponse.status} ${errorResponse.statusText}): ${errorResponse.responseText}`
                    console.warn(__NAME__, msg)
                    reject(new Error(msg))
                },
            })
        })

        emotes.push(...(await request))
    }

    return emotes
}

function uniqueCommentUrls(comments: Array<RedditComment>): Array<string> {
    const visitedEmotes = new Set<string>() // If multiple comments use the same emote, only need to fetch one comment
    const urls = new Set<string>()

    for (const comment of comments) {
        for (const wrappedEmote of comment.wrappedEmotes) {
            if (visitedEmotes.has(wrappedEmote)) {
                continue
            }

            visitedEmotes.add(wrappedEmote)
            urls.add(new URL(`${comment.permalink}.json`, 'https://www.reddit.com').href)
        }
    }

    return [...urls]
}

function getEmoteMeta(response: RedditCommentResponse): Array<EmoteMeta> {
    const subreddit = response[1].data.children[0].data.subreddit
    const mediaMetaData = Object.values(response[1].data.children[0].data.media_metadata ?? {})
    const emotes = new Array<EmoteMeta>()

    for (const media of mediaMetaData) {
        const matches = /emote\|(t5_\w+)\|(\d+)/.exec(media.id)
        if (!matches || matches.length !== 3) {
            continue
        }

        const subredditName = matches[1]
        const id = matches[2]
        const url = media.s.u
        if (!url) {
            continue
        }

        emotes.push({
            id,
            url,
            subredditName,
            subreddit,
        })
    }

    return emotes
}
