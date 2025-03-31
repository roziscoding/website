export interface Post {
  cid: string
  uri: string
  record: {
    createdAt: string
    text: string
  }
}

export function enrichPost(post: Post) {
  if (!post) return post
  const count = post.record.text.match(/lkpc:(?<count>\d+)/)?.groups?.count

  return {
    ...post,
    recordId: post.uri.split('/').pop()!,
    record: {
      ...post.record,
      createdAt: new Date(post.record.createdAt),
      text: post.record.text.replace('#healthUpdate', '').replace(/lkpc:\d+/, ''),
    },
    count: count ? Number(count) : undefined,
  }
}

export type EnrichedPost = ReturnType<typeof enrichPost>

export function getTitle(post: EnrichedPost | undefined, hideCount = false) {
  if (!post)
    return 'Update não encontrado'
  const formated = new Date(post.record.createdAt).toLocaleString('pt', {
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const count = post.count && !hideCount ? ` - ${post.count}k plaquetas` : ''

  return `${formated}${count}`
}

export function usePosts() {
  const fetchUrl = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=healthUpdate&author=roz.ninja'

  return useFetch<{ posts: Post[] }>(fetchUrl, {
    immediate: true,
  })
}
