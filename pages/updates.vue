<script setup lang="ts">
definePageMeta({
  layout: 'grey',
  title: 'Atualizações',
})
const runtimeConfig = useRuntimeConfig()

const url = 'https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=healthUpdate&author=roz.ninja'
const serviceWorkerReady = ref(false)
onMounted(() => {
  if (typeof NotificationEvent !== 'undefined') {
    navigator.serviceWorker.ready.then(() => {
      serviceWorkerReady.value = true
    })
  }
})

interface Post {
  cid: string
  record: {
    createdAt: string
    text: string
  }
}

type EnrichedPost = Post & { count?: number }

function enrichPost(post: Post): EnrichedPost {
  const count = post.record.text.match(/lkpc:(?<count>\d+)/)?.groups?.count

  return {
    ...post,
    record: {
      ...post.record,
      text: post.record.text.replace('#healthUpdate', '').replace(/lkpc:\d+/, ''),
    },
    count,
  }
}

const { data: posts, status, error, refresh } = useFetch<{ posts: Post[] }>(url, {
  transform: data => data.posts.map(enrichPost),
  immediate: true,
})

const channel = new BroadcastChannel('sw-messages')

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
function urlBase64ToUint8Array(base64String) {
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

async function enablePush(subscription: PushSubscription) {
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

async function disablePush(subscription: PushSubscription) {
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

function getTitle(post: EnrichedPost) {
  const formated = new Date(post.record.createdAt).toLocaleString('pt', {
    hour12: false,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const count = post.count ? ` - ${post.count}k plaquetas` : ''

  return `${formated}${count}`
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
        <p v-else class="nes-text is-success">
          Atualizado a {{ seconds }} segundo{{ seconds !== 1 ? 's' : '' }}.
        </p>
        <button v-if="serviceWorkerReady" type="button" class="nes-btn is-warning mt-4" @click="toggleNotifications">
          {{ notificationsButtonText }}
        </button>
      </div>
      <article v-for="post of posts" :id="post.cid" :key="post.cid" class="nes-container is-rounded is-dark with-title">
        <span class="title">{{ getTitle(post) }}</span>
        <p>
          {{ post.record.text }}
        </p>
      </article>
      <article v-if="!posts?.length" class="is-rounded is-dark text-center">
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
