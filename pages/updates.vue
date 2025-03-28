<script setup lang="ts">
definePageMeta({
  layout: 'grey',
  title: 'Atualizações',
})

const url = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=healthUpdate&author=roz.ninja'

interface Post {
  cid: string
  record: {
    createdAt: string
    text: string
  }
}

const { data: posts, status, error, refresh } = useFetch<{ posts: Post[] }>(url, {
  transform: data => data.posts.map(post => ({ ...post, record: { ...post.record, text: post.record.text.replace('#healthUpdate', '') } })),
  immediate: true,
})

const REFRESH_INTERVAL = 60_000 // 1 minute
const lastRefresh = ref(Date.now())
const diff = ref(0)
const seconds = computed(() => Math.floor(diff.value / 1000))
function doRefresh(force = false) {
  diff.value = Date.now() - lastRefresh.value
  if (!force && diff.value < REFRESH_INTERVAL)
    return
  lastRefresh.value = Date.now()
  diff.value = 0
  refresh()
}
setInterval(doRefresh, 1000)
</script>

<template>
  <div class="my-container flex justify-center align-middle flex-col gap-4">
    <header class="header mt-12">
      <h1 class="nes-text is-primary text-center py-4">
        Updates
      </h1>
      <p class="nes-text is-disabled text-center pb-4">
        Informações sobre o estado de saúde do Roz<br>
      </p>
    </header>
    <main class="md:mx-24 flex flex-col gap-4">
      <div class="status-indicator text-center">
        <p v-if="status === 'pending'" class="nes-text is-warning">
          Atualizando...
        </p>
        <p v-else-if="status === 'error'" class="nes-text is-error">
          {{ error }}
        </p>
        <p v-else class="nes-text is-success">
          Atualizado a {{ seconds }} segundo{{ seconds !== 1 ? 's' : '' }}.
          <button type="button" class="nes-text nes-pointer underline is-primary mt-4" @click="doRefresh(true)">
            Atualizar agora
          </button>
        </p>
      </div>
      <article v-for="post of posts" :key="post.cid" class="nes-container is-rounded is-dark with-title">
        <span class="title">{{ new Date(post.record.createdAt).toLocaleString() }}</span>
        <p>
          {{ post.record.text }}
        </p>
      </article>
      <article v-if="!posts.length" class="is-rounded is-dark text-center">
        <i class="nes-smartphone is-large" />
        <p class="my-4 nes-text is-error">
          Nenhuma atualização encontrada
        </p>
      </article>
    </main>
  </div>
</template>

<style scoped>
body {
  background-color: #212529
}
</style>
