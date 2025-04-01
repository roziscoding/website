export const useLikeStore = defineStore(
  'likedPosts',
  () => {
    const baseUrl = useRuntimeConfig().public.pushBaseUrl
    const likedPosts = ref<string[]>([])
    const likes = ref<Record<string, number>>({})

    async function fetchLikes() {
      const upstreamLikes = await $fetch(`${baseUrl}/likes`, { method: 'GET' })
        .then(body => body.likes)

      likes.value = upstreamLikes
    }

    async function like(recordId: string) {
      likedPosts.value.push(recordId)
      likes[recordId] ??=  0
      likes[recordId]++
      await $fetch(`${baseUrl}/${recordId}/likes`, { method: 'POST' })
      await fetchLikes()
    }

    async function dislike(recordId: string) {
      likedPosts.value = likedPosts.value.filter(id => id !== recordId)
      likes[recordId] ??= 0
      likes[recordId] = Math.max(0, likes[recordId] - 1)
      await $fetch(`${baseUrl}/${recordId}/likes`, { method: 'DELETE' })
      await fetchLikes()
    }

    function isLiked(recordId: string) {
      return likedPosts.value.includes(recordId)
    }

    function getLikes(recordId: string) {
      return likes[recordId] ?? 0
    }

    return { likedPosts, likes, like, dislike, isLiked, getLikes, fetchLikes }
  },
  {
    persist: true,
  },
)
