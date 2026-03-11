import { computed, onMounted } from 'vue'
import { useStore } from '../store/useStore.ts'
import type { CommentMeta } from '../utils/CommentMeta.ts'
import type { EmoteMeta } from '../utils/EmoteMeta.ts'

export function useRedditCommentTransformer() {
    const store = useStore()
    const maxEmbedWidth = computed(() => store.maxEmbedWidth)

    onMounted(async () => {
        const comments = getCommentsWithMedia()
        await store.fetchEmotes(comments)

        injectEmotes(comments, store.cachedEmotes)
        injectEscapedImgEmbeds(comments, maxEmbedWidth.value)
        injectProcessingImgEmbed(comments, maxEmbedWidth.value)
    })
}

function getCommentsWithMedia() {
    const comments = new Array<CommentMeta>()

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
        const hasEscapedImgEmbed = /<image>/.test(textNode.textContent)
        const hasProcessingImgEmbed = /Processing img \w+\.\.\./.test(textNode.textContent)

        // Only interested in comments with some media
        if (!(wrappedEmotes.length > 0 || hasEscapedImgEmbed || hasProcessingImgEmbed)) {
            continue
        }

        comments.push({
            commentName,
            permalink,
            subredditName,
            textNode,

            wrappedEmotes,
            hasEscapedImgEmbed,
            hasProcessingImgEmbed,
        })
    }

    return comments
}

function injectEmotes(comments: Array<CommentMeta>, cachedEmotes: Array<EmoteMeta>): void {
    for (const comment of comments) {
        if (comment.wrappedEmotes.length === 0) {
            continue
        }

        const originalCommentText = comment.textNode.textContent?.trim()

        for (const wrappedEmote of comment.wrappedEmotes) {
            const emote = cachedEmotes.find((emote) => `:${emote.id}:` === wrappedEmote)
            if (!emote) {
                console.warn(__NAME__, 'Failed to match emote', wrappedEmote, comment)
                continue
            }

            const isEmoteAlone = (originalCommentText === wrappedEmote)
            const emoteImgTag = `
                <img
                    src="${emote.url}"
                    width="${isEmoteAlone ? 60 : 20}"
                    height="${isEmoteAlone ? 60 : 20}"
                    title="${emote.id}"
                    style="display: inline-block; vertical-align: middle; margin: 0 2px;"
                >
            `

            comment.textNode.innerHTML = comment.textNode.innerHTML.replaceAll(wrappedEmote, emoteImgTag)
        }
    }
}

function injectEscapedImgEmbeds(comments: Array<CommentMeta>, maxEmbedWidth: number): void {
    for (const comment of comments) {
        if (!comment.hasEscapedImgEmbed) {
            continue
        }

        comment.textNode.innerHTML = comment.textNode.innerHTML.replaceAll(
            /<a href="([\w\\/?=&:;.]+)" (.+)>&lt;image&gt;<\/a>/g,
            `
                <a href="$1" $2>
                    <img
                        src="$1"
                        title="$1"
                        style="display: inline-block; vertical-align: middle; max-width:${maxEmbedWidth}px;"
                    >
                </a>
            `,
        )
    }
}

function injectProcessingImgEmbed(comments: Array<CommentMeta>, maxEmbedWidth: number): void {
    for (const comment of comments) {
        if (!comment.hasProcessingImgEmbed) {
            continue
        }

        comment.textNode.innerHTML = comment.textNode.innerHTML.replaceAll(
            /Processing img (\w+)\.\.\./g,
            `
                <a href="https://i.redd.it/$1.gif">
                    <img
                        src="https://i.redd.it/$1.gif"
                        title="$1"
                        style="display: inline-block; vertical-align: middle; max-width:${maxEmbedWidth}px;"
                    >
                </a>
            `,
        )
    }
}
