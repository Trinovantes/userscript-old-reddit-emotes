export interface EmoteComment {
    permalink: string // path
    subredditName: string // t5_{subreddit id}
    $textNode: JQuery<HTMLElement>
    wrappedEmotes: Array<string>
}
