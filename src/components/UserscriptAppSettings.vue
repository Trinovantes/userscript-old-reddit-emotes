<script lang="ts" setup>
import { projectTitle, projectUrl } from '@/Constants'
import { useStore } from '@/store/useStore'

const emit = defineEmits(['close'])
const store = useStore()
const save = async() => {
    await store.save()
    emit('close')
}
const clearCache = async() => {
    await store.reset()
    emit('close')
}
const cancel = async() => {
    await store.load()
    emit('close')
}
</script>

<template>
    <article>
        <div class="group header flex-vgap">
            <h1>
                {{ projectTitle }}
            </h1>
            <a :href="projectUrl" class="project-url">
                {{ projectUrl }}
            </a>
        </div>

        <div class="group flex-vgap">
            <div class="setting">
                <label for="maxEmbedWidth">
                    <strong>
                        Max Embed Width (px)
                    </strong>
                </label>
                <div>
                    <input
                        id="maxEmbedWidth"
                        v-model.number="store.maxEmbedWidth"
                        type="number"
                    >
                </div>
            </div>
        </div>

        <div
            v-for="[subreddit, emotes] of Object.entries(store.emotesBySubreddit)"
            :key="subreddit"
            class="group flex-vgap"
        >
            <h2>r/{{ subreddit }}</h2>

            <div class="emotes">
                <div
                    v-for="emote of emotes"
                    :key="emote.id"
                    class="emote"
                >
                    <img
                        :src="emote.url"
                        :title="emote.id"
                    >

                    <code>:{{ emote.id }}:</code>
                </div>
            </div>
        </div>

        <div class="group actions flex-hgap">
            <button
                class="positive"
                @click="save"
            >
                Save
            </button>
            <button
                class="negative"
                @click="clearCache"
            >
                Clear Cache
            </button>
            <div class="flex-1" />
            <button
                @click="cancel"
            >
                Cancel
            </button>
        </div>
    </article>
</template>

<style lang="scss" scoped>
article{
    display: grid;
    max-height: 80vh;
    overflow-y: auto;
    width: 60vw;
}

.group{
    padding: $padding;

    &:not(:first-child){
        border-top: $border;
    }

    &.header{
        gap: math.div($padding, 2);
    }
}

.setting{
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $padding;
}

.emotes{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: math.div($padding, 2);

    .emote{
        display: flex;
        align-items: center;
        gap: math.div($padding, 2);

        img{
            display: block;
            width: 20px; height: 20px;
        }

        code{
            font-family: 'Courier New', Courier, monospace;
            line-height: 20px;

            display: block;
        }
    }
}
</style>
