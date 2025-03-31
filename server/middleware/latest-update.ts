import { enrichPost } from '~/composables/posts'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)

  if (url.toString().endsWith('/updates/latest')) {
    const post = await fetch('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=healthUpdate&author=roz.ninja')
      .then(response => response.json())
      .then(body => body.posts as Post[])
      .then(posts => posts.length ? posts.shift()! : null)
      .then(post => post && enrichPost(post))

    if (post)
      return sendRedirect(event, `/updates/${post?.recordId}`)
  }
})
