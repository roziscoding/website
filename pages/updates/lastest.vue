<script setup lang="ts">
import { enrichPost, usePosts } from '~/posts';

const { data: _posts } = await usePosts()

const posts = computed(() => (_posts.value?.posts ?? []).map(enrichPost))

watch(posts, (value) => {
  const post = value?.shift()
  if (!post) return navigateTo('/updates')
  navigateTo({ name: 'updates-updateId', params: { updateId: post.recordId } })
})
</script>

<template>
  <div class="flex size-full justify-center align-center">
    <span class="nes-text is-warning">Carregando...</span>
  </div>
</template>