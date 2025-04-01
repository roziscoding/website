<script setup lang="ts">
import type { EnrichedPost } from '~/composables/posts'
import { enrichPost, getTitle, usePosts } from '~/composables/posts'

definePageMeta({
  layout: 'grey',
})
const route = useRoute()
const recordId = route.params.updateId

const { data: _posts, error, status } = await usePosts()

const posts = computed(() => (_posts.value?.posts ?? []).map(enrichPost))
const postIndex = computed(() => posts.value.findIndex(post => post.recordId === recordId))
const post = computed(() => posts.value[postIndex.value])
const previousPost = computed(() => posts.value[postIndex.value + 1])
const nextPost = computed(() => posts.value[postIndex.value - 1])
const firstPost = computed(() => posts.value[posts.value.length - 1])
const lastPost = computed(() => posts.value[0])
const plateletColor = computed(() => post.value.count
  ? post.value.count <= 10
    ? 'error'
    : post.value.count <= 20
      ? 'warning'
      : 'success'
  : undefined)

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
  title: post.value.record.createdAt.toLocaleString('pt-br', { timeStyle: 'short', dateStyle: 'short', timeZone: 'America/Sao_Paulo' }),
  subtitle: post.value.count ? `${post.value.count}k plaquetas` : undefined,
  subtitleColor: post.value.count ? plateletColor.value : undefined,
  text: post.value.record.text,
})
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-10 justify-center items-center w-full h-full p-10">
    <div class="flex flex-col gap-4 justify-center items-center">
      <h1 class="nes-text is-primary">
        Update {{ posts.length - postIndex }} de {{ posts.length }}
      </h1>
      <h1 class="nes-text is-warning text-center">
        Postado em {{ post.record.createdAt.toLocaleString('pt-br', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Sao_Paulo' }) }}
      </h1>
      <h2 v-if="post.count" class="nes-text" :class="`is-${plateletColor}`">
        {{ post.count }}k plaquetas
      </h2>
      <h2 v-else>
        &nbsp;
      </h2>
    </div>
    <LoadingContainer :status="status" dark>
      <template #error>
        <span class="nes-text text-center is-error">{{ error }}</span>
      </template>

      <template #pending>
        <span class="nes-text text-center is-warning">Carregando update...</span>
      </template>

      <UpdateCard :post="post" />
    </LoadingContainer>
    <div class="flex flex-row items-center gap-2">
      <button class="nes-btn" title="Primeiro Update" :class="!previousPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!previousPost" @click="() => goToPost(firstPost)">
        {{ "<<" }}<span class="hidden md:inline"> Primeiro</span>
      </button>
      <button class="nes-btn" :class="!previousPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!previousPost" @click="() => goToPost(previousPost)">
        {{ "<" }}<span class="hidden md:inline"> Anterior</span>
      </button>
      <span class="nes-text is-disabled hidden md:inline">|</span>
      <button class="nes-btn" :class="!nextPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!nextPost" @click="() => goToPost(nextPost)">
        <span class="hidden md:inline">Próximo </span>{{ ">" }}
      </button>
      <button class="nes-btn" title="Último update" :class="!nextPost ? ['is-disabled', 'cursor-not-allowed'] : ['is-primary']" :disabled="!nextPost" @click="() => goToPost(lastPost)">
        <span class="hidden md:inline">Último </span>{{ ">>" }}
      </button>
    </div>
    <a href="/updates" class="nes-btn is-success">
      Ver todos os updates
    </a>
  </div>
</template>
