<script lang="ts" setup>
import { ref } from 'vue'
import { TITLE } from '../Constants'
import { useRedditEmotes } from '@/utils/useRedditEmotes'
import UserscriptAppSettings from './UserscriptAppSettings.vue'

const isOpen = ref(false)

useRedditEmotes()
</script>

<template>
    <div class="template-userscript">
        <div
            v-if="isOpen"
            class="dialog-wrapper"
        >
            <div class="dialog">
                <UserscriptAppSettings
                    @close="isOpen = false"
                />
            </div>
        </div>

        <a
            class="settings-btn"
            :title="TITLE"
            @click="isOpen = true"
        >
            Settings
        </a>
    </div>
</template>

<style lang="scss">
// Cannot use scoped or else user agent stylesheet will override the attribute selector (for some reason)
.template-userscript *{
    background: none;
    outline: none;
    border: none;
    margin: 0;
    padding: 0;

    color: #111;
    font-size: 15px;
    font-weight: normal;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    vertical-align: baseline;
}
</style>

<style lang="scss" scoped>
a.settings-btn{
    @extend .icon-btn;

    position: fixed;
    bottom: $padding;
    right: $padding;
    z-index: 9999;

    background-image: url('@/assets/img/settings.png');
    box-shadow: rgba(11, 11, 11, 0.1) 0 2px 8px;

    &:hover{
        box-shadow: rgba(11, 11, 11, 0.4) 0 0px 8px;
    }
}

.dialog-wrapper{
    background: rgba(11, 11, 11, 0.4);

    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 99999;

    > .dialog{
        background: white;
        padding: $padding;
        border-radius: $border-radius;

        position: absolute;
        top: 50%; left: 50%;
        transform: translateY(-50%) translateX(-50%);
        min-width: $min-dialog-width;
    }
}
</style>
