import './assets/css/main.scss'
import { createVueApp } from './createVueApp'
import { isOldCommentsPage } from './utils/isOldCommentsPage'

async function main() {
    if (!isOldCommentsPage()) {
        return
    }

    const node = document.createElement('div')
    node.id = DEFINE.NAME
    document.querySelector('body')?.appendChild(node)

    const app = await createVueApp()
    app.mount(node)
}

if (document.readyState !== 'loading') {
    void main()
} else {
    window.addEventListener('DOMContentLoaded', () => {
        void main()
    })
}
