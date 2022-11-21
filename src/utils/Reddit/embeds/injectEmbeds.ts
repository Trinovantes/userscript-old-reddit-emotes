import type { RedditComment } from '../RedditComment'

export function injectEmbeds(comments: Array<RedditComment>): void {
    for (const comment of comments) {
        const numEmbeds = (comment.$textNode.html().match(/&lt;image&gt;/g) ?? []).length

        comment.$textNode.html((idx, oldHtml) => {
            for (let i = 0; i < numEmbeds; i++) {
                oldHtml = oldHtml.replace(/<a href="([\w\\/?=&:;.]+)" (.+)>&lt;image&gt;<\/a>/, `
                    <a href="$1" $2>
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
