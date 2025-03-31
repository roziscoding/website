<script setup lang="ts">
import type { EnrichedPost } from '~/posts'
import { enrichPost, getTitle, usePosts } from '~/posts'

definePageMeta({
  layout: 'grey',
})
const route = useRoute()
const recordId = route.params.updateId

if (Array.isArray(recordId) || !recordId) {
  navigateTo('/updates')
}

const { data: _posts, error, status } = await usePosts()

const posts = computed(() => (_posts.value?.posts ?? []).map(enrichPost))
const postIndex = computed(() => posts.value.findIndex(post => post.recordId === route.params.updateId))
const post = computed(() => posts.value[postIndex.value])
const previousPost = computed(() => posts.value[postIndex.value + 1])
const nextPost = computed(() => posts.value[postIndex.value - 1])
const firstPost = computed(() => posts.value[posts.value.length - 1])
const lastPost = computed(() => posts.value[0])


watchEffect(() => {
  if (!post.value && status.value !== 'pending') {
    return navigateTo('/updates', { replace: true })
  }
})

function goToPost(post: (EnrichedPost | undefined) | Ref<EnrichedPost | undefined>) {
  const postValue = unref(post)
  if (!postValue) {
    return
  }

  const to = { name: 'updates-updateId', params: { updateId: postValue.recordId } }
  navigateTo(to)
}
const pageTitle = computed(() => getTitle(post.value, true))
useSeoMeta({
  title: pageTitle.value,
  ogTitle: `Updates do Roz - ${pageTitle.value}`,
  description: post.value.record.text,
  ogDescription: post.value.record.text,
  twitterCard: 'summary_large_image',
})

defineOgImageComponent('LargeText', {
  title: post.value.record.createdAt.toLocaleString('pt-br', { timeStyle: 'short', dateStyle: 'short' }),
  text: post.value.record.text
})
</script>

<template>
  <div class="flex flex-col gap-10 justify-center items-center h-[100vh] w-[100vw]">
    <div class="flex flex-col gap4 justify-center items-center">
      <h1 class="nes-text is-primary">
        Update {{ posts.length - postIndex }} de {{ posts.length }}
      </h1>
      <h1 class="nes-text is-warning">
        Postado em {{ post.record.createdAt.toLocaleString('pt-br', { dateStyle: 'long', timeStyle: 'short' }) }}
      </h1>
      <h2 v-if="post.count" class="nes-text" :class="{ 'is-error': post.count <= 10, 'is-warning': post.count <= 20, 'is-success': post.count > 20 }">
        {{ post.count }}k plaquetas
      </h2>
      <h2 v-else>
&nbsp;
      </h2>
    </div>
    <div class="nes-container is-dark w-[80%]" :class="{ 'text-center': ['error', 'pending'].includes(status) }">
      <template v-if="status === 'success'">
        {{ post?.record.text }}
      </template>
      <template v-else-if="status === 'pending'">
        <span class="nes-text is-warning">Carregando update...</span>
      </template>
      <template v-else-if="status === 'error'">
        <span class="nes-text is-error">{{ error }}</span>
      </template>
    </div>
    <div class="flex flex-row items-center gap-2">
      <button class="nes-btn" title="Primeiro Update" :class="!previousPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!previousPost" @click="() => goToPost(firstPost)">
        << Primeiro
      </button>
      <button class="nes-btn" :class="!previousPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!previousPost" @click="() => goToPost(previousPost)">
        < Anterior
      </button>
      <span class="nes-text is-disabled">|</span>
      <button class="nes-btn" :class="!nextPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!nextPost" @click="() => goToPost(nextPost)">
        Próximo >
      </button>
      <button class="nes-btn" title="Último update" :class="!nextPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!nextPost" @click="() => goToPost(lastPost)">
        Último >>
      </button>
    </div>
    <a href="/updates" class="nes-btn is-success">
      Ver todos os updates
    </a>
  </div>
</template>
