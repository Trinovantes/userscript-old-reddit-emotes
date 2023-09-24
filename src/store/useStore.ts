import { defineStore } from 'pinia'
import { RedditComment } from '../utils/RedditComment'
import { EmoteMeta } from '../utils/EmoteMeta'
import { DEFAULT_MAX_EMBED_WIDTH } from '@/Constants'

const HYDRATION_KEY = '__INITIAL_STATE__'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type State = {
    maxEmbedWidth: number
    cachedEmotes: Array<EmoteMeta>
}

function createDefaultState(): State {
    const defaultState: State = {
        maxEmbedWidth: DEFAULT_MAX_EMBED_WIDTH,
        cachedEmotes: [],
    }

    return defaultState
}

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export const useStore = defineStore('Store', {
    state: createDefaultState,

    getters: {
        emotesBySubreddit: (state): Record<string, Array<EmoteMeta>> => {
            const groupedEmotes: Record<string, Array<EmoteMeta>> = {}

            for (const emote of state.cachedEmotes) {
                if (!(emote.subreddit in groupedEmotes)) {
                    groupedEmotes[emote.subreddit] = []
                }

                groupedEmotes[emote.subreddit].push(emote)
            }

            return groupedEmotes
        },
    },

    actions: {
        async load(): Promise<void> {
            try {
                const stateString = await GM.getValue(HYDRATION_KEY, '{}')
                const parsedState = JSON.parse(stateString) as Partial<State>
                this.$patch(parsedState)
                console.info(DEFINE.NAME, 'Store::load', parsedState)
            } catch (err) {
                console.warn(err)
            }
        },

        async save(): Promise<void> {
            try {
                const stateString = JSON.stringify(this.$state)
                await GM.setValue(HYDRATION_KEY, stateString)
                console.info(DEFINE.NAME, 'Store::save', JSON.parse(stateString))
            } catch (err) {
                console.warn(err)
            }
        },

        async reset(): Promise<void> {
            this.$reset()
            await this.save()
        },

        hasCachedEmote(subredditName: string, emoteId: string): boolean {
            return Boolean(this.cachedEmotes.find((emote) => emote.subredditName === subredditName && emote.id === emoteId))
        },

        hasCachedAllEmotesInComment(comment: RedditComment): boolean {
            for (const wrappedEmote of comment.wrappedEmotes) {
                const emoteId = wrappedEmote.substring(1, wrappedEmote.length - 1)
                if (!this.hasCachedEmote(comment.subredditName, emoteId)) {
                    return false
                }
            }

            return true
        },

        async cacheEmotes(emotes: Array<EmoteMeta>): Promise<void> {
            for (const emote of emotes) {
                if (this.hasCachedEmote(emote.subredditName, emote.id)) {
                    continue
                }

                this.cachedEmotes.push(emote)
            }

            await this.save()
        },
    },
})
