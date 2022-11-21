import { createPinia } from 'pinia'
import { createApp } from 'vue'
import UserscriptApp from './components/UserscriptApp.vue'
import { isCommentsPage } from './utils/Reddit/isCommentsPage'

async function main() {
    if (!isCommentsPage()) {
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
