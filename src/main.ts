import { createPinia } from 'pinia'
import { createApp } from 'vue'
import UserscriptApp from './components/UserscriptApp.vue'
import { isOldCommentsPage } from './utils/Reddit/isOldCommentsPage'

async function main() {
    if (!isOldCommentsPage()) {
        return
    }

    await $.when($.ready)
    const appContainerId = DEFINE.NAME
    $('body').append(`<div id="${appContainerId}">`)

    const app = createApp(UserscriptApp)
    const pinia = createPinia()
    app.use(pinia)
    app.mount(`#${appContainerId}`)
}

main().catch((err) => {
    console.warn(DEFINE.NAME, err)
})
