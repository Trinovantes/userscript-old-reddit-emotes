import { getLogger } from './getLogger'
import type { EmoteComment } from './EmoteComment'
import type { EmoteMeta } from './EmoteMeta'

const { logWarn } = getLogger('injectEmotes')

export function injectEmotes(comments: Array<EmoteComment>, emotes: Array<EmoteMeta>): void {
    for (const comment of comments) {
        const originalCommentText = comment.$textNode.text().trim()

        for (const wrappedEmote of comment.wrappedEmotes) {
            const emote = emotes.find((emote) => `:${emote.id}:` === wrappedEmote)
            if (!emote) {
                logWarn('Failed to match emote', wrappedEmote, comment)
                continue
            }

            const isEmoteAlone = originalCommentText === wrappedEmote
            comment.$textNode.html((idx, oldHtml) => oldHtml.replaceAll(wrappedEmote, getEmoteImg(emote, isEmoteAlone)))
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
