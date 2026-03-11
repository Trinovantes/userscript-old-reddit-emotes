export type CommentMeta = {
    commentName: string // t1_{comment id}
    permalink: string // url
    subredditName: string // t5_{subreddit id}
    textNode: Element

    wrappedEmotes: Array<string> // e.g. :12345:
    hasEscapedImgEmbed: boolean // Comments with "&lt;image&gt;" text
    hasProcessingImgEmbed: boolean // Comments with "Processing img ..." text
}
