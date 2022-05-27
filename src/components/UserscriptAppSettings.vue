<script lang="ts" setup>
import { TITLE } from '@/Constants'
import { useStore } from '@/store'

defineEmits(['close'])

const projectUrl = DEFINE.REPO.url
const store = useStore()
</script>

<template>
    <div class="settings">
        <div class="group">
            <h1>
                {{ TITLE }}
            </h1>
            <a :href="projectUrl" class="project-url">
                {{ projectUrl }}
            </a>
        </div>

        <div
            v-for="[subreddit, emotes] of Object.entries(store.emotesBySubreddit)"
            :key="subreddit"
            class="group"
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
                        :title="`:${emote.id}:`"
                    >

                    <code>:{{ emote.id }}:</code>
                </div>
            </div>
        </div>

        <div class="group actions">
            <a
                class="btn positive"
                @click="store.reset(); $emit('close')"
            >
                Clear Cache
            </a>
            <div class="hspace" />
            <a
                class="btn"
                @click="store.load(); $emit('close')"
            >
                Cancel
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.settings{
    display: grid;
    gap: $padding;
}

.group{
    display: grid;
    gap: math.div($padding, 2);

    &:not(:first-child){
        border-top: $border;
        padding-top: $padding;
    }

    &.actions{
        display: flex;
        gap: math.div($padding, 2);

        .hspace{
            flex: 1;
        }
    }
}

h1{
    font-size: 24px;
    font-weight: bold;
}

h2{
    font-size: 21px;
    font-weight: bold;
}

a.project-url{
    display: block;
    color: blue;
    text-decoration: none;

    &:hover{
        text-decoration: underline;
    }
}

label{
    cursor: pointer;
    font-weight: bold;

    align-items: center;
    display: grid;
    gap: math.div($padding, 2);
    grid-template-columns: 1fr 2fr;
    justify-items: left;
}

input{
    font-weight: normal;

    border: $border;
    border-radius: $border-radius;
    padding: math.div($padding, 4);

    &:focus{
        border-color: black;
    }

    &:not([type='checkbox']){
        width: 100%;
    }
}

a.btn{
    background-color: white;
    border: $border;
    border-radius: $border-radius;
    cursor: pointer;
    display: inline-block;
    padding: math.div($padding, 4) math.div($padding, 2);
    text-decoration: none;

    &:hover{
        background-color: #eee;
    }

    &.positive{
        background-color: green;
        border-color: darkgreen;
        color: white;

        &:hover{
            background-color: darkgreen;
        }
    }
}

.emotes{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
