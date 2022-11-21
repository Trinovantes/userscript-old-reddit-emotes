export type RedditComment = {
    commentName: string // t1_{comment id}
    permalink: string // url
    subredditName: string // t5_{subreddit id}
    $textNode: JQuery<HTMLElement>
    wrappedEmotes: Array<string> // e.g. :12345:
}
