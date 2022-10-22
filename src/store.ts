import { defineStore } from 'pinia'
import { fetchEmotes } from './utils/fetchEmotes'
import { getLogger } from './utils/getLogger'
import type { EmoteComment } from './utils/EmoteComment'
import type { EmoteMeta } from './utils/EmoteMeta'

const HYDRATION_KEY = '__INITIAL_STATE__'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type State = {
    cachedEmotes: Array<EmoteMeta>
}

function createDefaultState(): State {
    const defaultState: State = {
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
            const { logInfo, logWarn } = getLogger('store::Load')

            try {
                const stateString = await GM.getValue(HYDRATION_KEY, '{}') || '{}'
                const parsedState = JSON.parse(stateString) as Partial<State>

                this.$patch({
                    ...createDefaultState(),
                    ...parsedState,
                })

                logInfo(parsedState)
            } catch (err) {
                logWarn(err)
            }
        },

        async save(): Promise<void> {
            const { logInfo, logWarn } = getLogger('store::Save')

            try {
                const stateString = JSON.stringify(this.$state)
                await GM.setValue(HYDRATION_KEY, stateString)

                logInfo(stateString)
            } catch (err) {
                logWarn(err)
            }
        },

        async reset(): Promise<void> {
            this.$reset()
            await this.save()
        },

        hasCachedEmote(subredditName: string, wrappedEmote: string): boolean {
            return Boolean(this.cachedEmotes.find((emote) => emote.subredditName === subredditName && `:${emote.id}:` === wrappedEmote))
        },

        async fetchAndCacheEmotes(comments: Array<EmoteComment>): Promise<void> {
            const notCachedEmoteComments = new Array<EmoteComment>()

            for (const comment of comments) {
                for (const wrappedEmote of comment.wrappedEmotes) {
                    if (this.hasCachedEmote(comment.subredditName, wrappedEmote)) {
                        continue
                    }

                    notCachedEmoteComments.push(comment)
                }
            }

            const emotes = await fetchEmotes(notCachedEmoteComments)
            for (const emote of emotes) {
                if (this.hasCachedEmote(emote.subredditName, `:${emote.id}:`)) {
                    continue
                }

                this.cachedEmotes.push(emote)
            }

            await this.save()
        },
    },
})
