<script lang="ts" setup>
import { useTemplateRef } from 'vue'
import UserscriptAppSettings from './UserscriptAppSettings.vue'
import { useRedditCommentTransformer } from './useRedditCommentTransformer.ts'
import { projectTitle } from '../Constants.ts'

const dialogRef = useTemplateRef<HTMLDialogElement | null>('dialogRef')
useRedditCommentTransformer()
</script>

<template>
    <div class="userscript-old-reddit-emotes">
        <dialog
            ref="dialogRef"
        >
            <UserscriptAppSettings
                @close="dialogRef?.close()"
            />
        </dialog>

        <button
            class="settings-btn"
            :title="projectTitle"
            @click="dialogRef?.showModal()"
        >
            Settings
        </button>
    </div>
</template>

<style lang="scss" scoped>
button.settings-btn{
    background-image: url('../assets/img/settings.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: 50% 50%;
    border-radius: 50%;
    border: $border;
    cursor: pointer;
    display: block;
    overflow: hidden;
    text-decoration: none;
    text-indent: -9999px;
    transition: 0.25s;
    width: $btn-size; height: $btn-size;

    position: fixed;
    z-index: 9999;
    bottom: $padding;
    right: $padding;

    background-color: white;
    box-shadow: rgba(11, 11, 11, 0.1) 0 2px 8px;

    &:hover{
        background-color: #eee;
        box-shadow: rgba(11, 11, 11, 0.4) 0 0px 8px;
    }
}
</style>
