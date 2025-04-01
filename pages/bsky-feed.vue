<script setup lang="ts">
const search = ref('')
const baseUrl = 'https://public.api.bsky.app/xrpc/'
const feedPath = 'app.bsky.feed.getAuthorFeed'
const searchPath = 'app.bsky.feed.searchPosts'

const url = computed(() => search.value.trim() ? `${baseUrl}${searchPath}?q=${encodeURIComponent(search.value)}&author=roz.ninja` : `${baseUrl}${feedPath}?actor=roz.ninja`)
const { data, status, refresh, error } = await useAsyncData('postsWithImage', () => $fetch(url.value), { immediate: true, watch: [url] })
const posts = computed(() => (data.value?.posts ?? data.value?.feed.map(({ post }) => post) ?? []).map(enrichPost))
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="nes-container is-dark flex flex-col gap-4">
      <div class="flex flex-row items-end">
        <div class="nes-field flex-1">
          <label for="search">Search</label>
          <input id="search" v-model="search" type="text" name="search" class="nes-input is-dark">
        </div>
        <button class="nes-btn is-primary h-[48px]" @click="refresh">
          Search
        </button>
      </div>
      <a :href="url" class="nes-text is-primary text-center" target="_blank">
        {{ url }}
      </a>
    </div>
    <LoadingContainer :status dark :empty="!posts.length">
      <template #error>
        <span class="nes-text text-center is-error">{{ error }}</span>
      </template>
      <template #pending>
        <span class="nes-text text-center is-warning">Carregando...</span>
      </template>
      <template #idle>
        <span class="nes-text text-center is-primary">Idle...</span>
      </template>
      <template #empty>
        <span class="nes-text text-center is-primary">Nenhum post encontrado</span>
      </template>
      <template #default>
        <div class="flex flex-col gap-4">
          <UpdateCard
            v-for="post in posts"
            :key="post.cid"
            :post
            :title-link="`https://bsky.app/profile/roz.ninja/post/${post.recordId}`"
            :title="getTitle(post)"
            new-tab
          />
        </div>
      </template>
    </LoadingContainer>
  </div>
</template>
