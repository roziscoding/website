export const useLikeStore = defineStore(
  'likedPosts',
  () => {
    const likedPosts = ref<string[]>([])
    function like(recordId: string) {
      likedPosts.value.push(recordId)
    }
    function dislike(recordId: string) {
      likedPosts.value = likedPosts.value.filter(id => id !== recordId)
    }
    function isLiked(recordId: string) {
      return likedPosts.value.includes(recordId)
    }

    return { likedPosts, like, dislike, isLiked }
  },
  {
    persist: true,
  },
)
