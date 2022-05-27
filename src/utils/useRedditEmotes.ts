import { onMounted } from 'vue'
import { useStore } from '@/store'
import { getCommentsWithEmotes } from './getCommentsWithEmotes'
import { injectEmotes } from './injectEmotes'

export function useRedditEmotes() {
    const store = useStore()

    onMounted(async() => {
        const comments = getCommentsWithEmotes()
        await store.load()
        await store.fetchAndCacheEmotes(comments)
        injectEmotes(comments, store.cachedEmotes)
    })
}
