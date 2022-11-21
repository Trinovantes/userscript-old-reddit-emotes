import type { RedditComment } from '../RedditComment'

export function injectEmbeds(comments: Array<RedditComment>): void {
    for (const comment of comments) {
        comment.$textNode.html((idx, oldHtml) => {
            while (oldHtml.includes('&lt;image&gt;')) {
                oldHtml = oldHtml.replace(/<a href="([\w\\/?=&:;.]+)" target="_blank">&lt;image&gt;<\/a>/, `
                    <a href="$1" target="_blank">
                        <img
                            src="$1"
                            title="$1"
                            style="display: inline-block; vertical-align: middle;"
                        >
                    </a>
                `)
            }

            return oldHtml
        })
    }
}
