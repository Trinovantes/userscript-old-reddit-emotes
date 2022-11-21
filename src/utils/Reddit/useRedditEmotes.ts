import { onMounted } from 'vue'
import { useStore } from '@/store'
import { getCommentsWithEmbeds } from './embeds/getCommentsWithEmbeds'
import { injectEmbeds } from './embeds/injectEmbeds'
import { fetchRedditCommentEmotes } from './emotes/fetchRedditCommentEmotes'
import { getCommentsWithEmotes } from './emotes/getCommentsWithEmotes'
import { injectEmotes } from './emotes/injectEmotes'

export function useRedditEmotes() {
    const store = useStore()

    onMounted(async() => {
        await store.load()

        const commentsWithEmotes = getCommentsWithEmotes()
        const commentsToFetch = commentsWithEmotes.filter((comment) => !store.hasCachedAllEmotesInComment(comment))
        const emotes = await fetchRedditCommentEmotes(commentsToFetch)
        await store.cacheEmotes(emotes)
        injectEmotes(commentsWithEmotes, store.cachedEmotes)

        const commentsWithEmbeds = getCommentsWithEmbeds()
        injectEmbeds(commentsWithEmbeds)
    })
}
