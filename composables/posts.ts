export const EMOJI_REGEX = /([\u2700-\u27BF\uE000-\uF8FF\u2011-\u26FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF])/g

interface Image {
  alt?: string
  thumb: string
  fullsize: string
  aspectRatio: {
    height: number
    width: number
  }
}

export interface Post {
  cid: string
  uri: string
  record: {
    createdAt: string
    text: string
  }
  embed?: {
    images?: Image[]
    media: {
      images: Image[]
    }
  }
}

function srtipPatterns(str: string, patterns: Array<RegExp | string>) {
  return patterns.reduce((result, pattern) => (result as string).replace(pattern, ''), str) as string
}

export function enrichPost(post: Post) {
  if (!post)
    return post
  const count = post.record.text.match(/lkpc:(?<count>\d+)/)?.groups?.count

  return {
    ...post,
    recordId: post.uri.split('/').pop()!,
    record: {
      ...post.record,
      createdAt: new Date(post.record.createdAt),
      text: srtipPatterns(
        post.record.text,
        ['#healthUpdate', /lkpc:\d+/, EMOJI_REGEX],
      ),
    },
    count: count ? Number(count) : undefined,
  }
}

export type EnrichedPost = ReturnType<typeof enrichPost>

export function getTitle(post: EnrichedPost | undefined, hideCount = false) {
  if (!post)
    return 'Update não encontrado'
  const formated = new Date(post.record.createdAt).toLocaleString(new Intl.Locale('pt-BR'), {
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })

  const count = post.count && !hideCount ? ` - ${post.count}k plaquetas` : ''

  return `${formated}${count}`
}

export function usePosts() {
  const fetchUrl = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=healthUpdate&author=roz.ninja'

  return useAsyncData<{ posts: Post[] }>('posts', () => $fetch(fetchUrl), {
    immediate: true,
  })
}
