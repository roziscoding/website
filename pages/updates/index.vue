<script setup lang="ts">
import type { EnrichedPost } from '~/composables/posts'
import { enrichPost, getTitle, usePosts } from '~/composables/posts'

definePageMeta({
  layout: 'grey',
  title: 'Atualizações',
})
const runtimeConfig = useRuntimeConfig()

const serviceWorkerReady = ref(false)
const route = useRoute()
const highlightedPost = computed(() => route.hash?.replace('#', ''))

defineOgImageComponent('Regular', {
  title: 'Updates do Roz',
  image: '/avatar.png',
  description: 'Informações sobre o estado de saúde do roz',
  subheader: 'Atualizado geralmente por volta das 12h',
})

function isHighlighted(id: string) {
  return id === highlightedPost.value
}

function scrollHighlightIntoView() {
  if (!highlightedPost.value)
    return

  const el = document.getElementById(highlightedPost.value)
  if (!el)
    return
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

onMounted(() => {
  scrollHighlightIntoView()
  if (typeof Notification !== 'undefined') {
    navigator.serviceWorker.ready.then(() => {
      serviceWorkerReady.value = true
    })
  }
})

const { data:_posts, status, error, refresh } = await usePosts()
const posts = computed(() => (_posts.value?.posts ?? []).map(enrichPost))

watch([posts, highlightedPost], scrollHighlightIntoView)

const channel = new BroadcastChannel('sw-messages')

const REFRESH_INTERVAL = 60_000 // 1 minute
const lastRefresh = ref(Date.now())
const diff = ref(0)
const seconds = computed(() => Math.ceil((REFRESH_INTERVAL - diff.value) / 1000))

function doRefresh(force = false) {
  diff.value = Date.now() - lastRefresh.value
  if (!force && diff.value < REFRESH_INTERVAL)
    return
  lastRefresh.value = Date.now()
  diff.value = 0
  refresh()
}

channel.addEventListener('message', async (event) => {
  if (event.data.type !== 'new-post')
    return

  await doRefresh(true)
  const link = document.createElement('a')
  link.setAttribute('href', event.data.postUrl)
  link.click()
})

setInterval(doRefresh, 1000)

// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const enableNotifications = useLocalStorage('enableNotifications', false)
const notificationsButtonText = computed(() => `${enableNotifications.value ? 'Desativar' : 'Ativar'} Notificações`)

async function requestNotificationPermission() {
  if (Notification.permission === 'granted')
    return true

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

async function getSubscription() {
  const hasPermission = await requestNotificationPermission()
  if (!hasPermission)
    return

  const registration = await navigator.serviceWorker.ready
  const existingSubscription = await registration.pushManager.getSubscription()
  if (existingSubscription) {
    return existingSubscription
  }

  const vapidPublicKey = await fetch(`${runtimeConfig.public.pushBaseUrl}/vapidPublicKey`)
    .then(response => response.text())
    .then(urlBase64ToUint8Array)

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey,
  })

  return subscription
}

async function enablePush(subscription?: PushSubscription) {
  if (!subscription) {
    enableNotifications.value = false
    return
  }

  const response = await fetch(runtimeConfig.public.pushBaseUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      subscription,
    }),
  })

  if (response.ok) {
    enableNotifications.value = true
  }
}

async function disablePush(subscription?: PushSubscription) {
  if (!subscription) {
    enableNotifications.value = false
    return
  }

  const response = await fetch(runtimeConfig.public.pushBaseUrl, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      subscription,
    }),
  })

  if (response.ok) {
    enableNotifications.value = false
  }
}

async function toggleNotifications() {
  const subscription = await getSubscription()

  if (enableNotifications.value) {
    return disablePush(subscription)
  }

  enablePush(subscription)
}
</script>

<template>
  <div class="my-container flex justify-center align-middle flex-col">
    <header class="header mt-12">
      <h1 class="nes-text is-primary text-center py-4">
        Updates
      </h1>
      <p class="nes-text is-disabled text-center pb-4">
        Informações sobre o estado de saúde do Roz<br>
      </p>
    </header>
    <main class="md:mx-24 flex flex-col gap-4 text-xs md:text-base">
      <div class="status-indicator text-center">
        <p v-if="status === 'pending'" class="nes-text is-warning">
          Atualizando...
        </p>
        <p v-else-if="status === 'error'" class="nes-text is-error">
          {{ error }}
        </p>
        <p v-else class="nes-text is-success" @click="doRefresh(true)">
          Atualizando em {{ seconds }} segundo{{ seconds !== 1 ? 's' : '' }}.
        </p>
        <button v-if="serviceWorkerReady" type="button" class="nes-btn is-warning mt-4" @click="toggleNotifications">
          {{ notificationsButtonText }}
        </button>
      </div>
      <article v-for="post of posts" :id="post.recordId" :key="post.recordId" class="is-dark nes-container is-rounded with-title">
        <a :class="isHighlighted(post.recordId) ? ['!bg-white', '!text-black'] : []" :href="`/updates/${post.recordId}`" class="title">{{ getTitle(post) }}</a>
        <p>
          {{ post.record.text }}
        </p>
      </article>
      <article v-if="!posts" class="is-rounded is-dark text-center">
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
