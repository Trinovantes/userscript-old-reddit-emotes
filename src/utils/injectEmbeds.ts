import { RedditComment } from './RedditComment'

export function injectEmbeds(comments: Array<RedditComment>, maxEmbedWidth: number): void {
    for (const comment of comments) {
        const numEmbeds = (comment.textNode.innerHTML.match(/&lt;image&gt;/g) ?? []).length

        for (let i = 0; i < numEmbeds; i++) {
            comment.textNode.innerHTML = comment.textNode.innerHTML.replace(
                /<a href="([\w\\/?=&:;.]+)" (.+)>&lt;image&gt;<\/a>/,
                `
                    <a href="$1" $2>
                        <img
                            src="$1"
                            title="$1"
                            style="display: inline-block; vertical-align: middle; max-width:${maxEmbedWidth}px;"
                        >
                    </a>
                `,
            )
        }
    }
}
