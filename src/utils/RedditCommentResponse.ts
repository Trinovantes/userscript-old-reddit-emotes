type RedditPost = {
    kind: 't3'
    data: {
        id: string // id
        name: string // t1_{id}
        subreddit_id: string
    }
}

type RedditComment = {
    kind: 't1'
    data: {
        id: string // id
        name: string // t3_{id}
        subreddit: string
        body: string
        body_html: string
        permalink: string
        media_metadata?: Record<string, {
            status: 'valid' | 'invalid'
            m: string // mimetype
            s: {
                x: number // width
                y: number // height

                gif?: string
                u?: string // url
            }
            t?: 'emoji' // type
            id: string
        }>
    }
}

export type RedditCommentResponse = [
    {
        kind: string
        data: {
            children: Array<RedditPost>
        }
    },
    {
        kind: string
        data: {
            children: Array<RedditComment>
        }
    },
]
