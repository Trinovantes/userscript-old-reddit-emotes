import { EmoteMeta } from './EmoteMeta'
import { RedditComment } from './RedditComment'

export function injectEmotes(comments: Array<RedditComment>, cachedEmotes: Array<EmoteMeta>): void {
    for (const comment of comments) {
        const originalCommentText = comment.textNode.textContent?.trim()

        for (const wrappedEmote of comment.wrappedEmotes) {
            const emote = cachedEmotes.find((emote) => `:${emote.id}:` === wrappedEmote)
            if (!emote) {
                console.warn(DEFINE.NAME, 'Failed to match emote', wrappedEmote, comment)
                continue
            }

            const isEmoteAlone = (originalCommentText === wrappedEmote)
            comment.textNode.innerHTML = comment.textNode.innerHTML.replaceAll(wrappedEmote, getEmoteImg(emote, isEmoteAlone))
        }
    }
}

function getEmoteImg(emote: EmoteMeta, largeIcon: boolean): string {
    return `
        <img
            src="${emote.url}"
            width="${largeIcon ? 60 : 20}"
            height="${largeIcon ? 60 : 20}"
            title="${emote.id}"
            style="display: inline-block; vertical-align: middle; margin: 0 2px;"
        >
    `
}
