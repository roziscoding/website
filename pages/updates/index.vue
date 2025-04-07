<script setup lang="ts">
import InAppSpy from 'inapp-spy'
import { enrichPost, getTitle, usePosts } from '~/composables/posts'

definePageMeta({
  layout: 'grey',
  title: 'Atualizações',
})

const runtimeConfig = useRuntimeConfig()
const likeStore = useLikeStore()
const serviceWorkerReady = ref(false)
const route = useRoute()
const highlightedPost = computed(() => route.hash?.replace('#', ''))
const { isIos } = useDevice()
const { $pwa } = useNuxtApp()
const showPwaInstructions = ref(false)

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
  setInterval(doRefresh, 1000)
})

const { data: _posts, status, error, refresh } = await usePosts()
const posts = computed(() => (_posts.value?.posts ?? []).map(enrichPost))

watch([posts, highlightedPost], scrollHighlightIntoView)

const channel = new BroadcastChannel('sw-messages')

const REFRESH_INTERVAL = 60_000 // 1 minute
const lastRefresh = ref(Date.now())
const diff = ref(0)
const seconds = computed(() => Math.ceil((REFRESH_INTERVAL - diff.value) / 1000))

async function doRefresh(force = false) {
  diff.value = Date.now() - lastRefresh.value

  if (!force && diff.value < REFRESH_INTERVAL)
    return

  lastRefresh.value = Date.now()
  diff.value = 0

  await Promise.all([refresh(), likeStore.fetchLikes()])
}

channel.addEventListener('message', async (event) => {
  if (event.data.type !== 'new-post')
    return

  await doRefresh(true)
})

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
const enableNotificationButton = computed(() => {
  if (!isIos || $pwa?.isPWAInstalled) {
    return serviceWorkerReady.value
  }

  return true
})

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
  const { isInApp } = InAppSpy()
  if (isInApp) {
    // eslint-disable-next-line no-alert
    return alert('Parece que a página está aberta no navegor do instagram. As notificações não funcionam por aqui. Clica nos três pontinhos e abre no navegador do celular :)')
  }

  if (isIos && !$pwa?.isPWAInstalled) {
    showPwaInstructions.value = true
    return
  }

  const subscription = await getSubscription()

  if (enableNotifications.value) {
    return disablePush(subscription)
  }

  enablePush(subscription)
}

defineOgImageComponent('Regular', {
  title: 'Updates do Roz',
  image: 'https://roz.ninja/avatar.png',
  description: 'Informações sobre o estado de saúde do roz',
  subheader: 'Atualizado geralmente por volta das 12h',
})

useSeoMeta({
  title: 'Updates do Roz',
  ogTitle: `Updates do Roz`,
  description: 'Updates sobre o estado de saúde do Roz',
  ogDescription: 'Updates sobre o estado de saúde do Roz',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="my-container flex justify-center align-middle flex-col">
    <PWAInstructions id="pwa-dialog" v-model:visible="showPwaInstructions" />
    <header class="header mt-12">
      <h1 class="nes-text is-primary text-center py-4">
        Updates
      </h1>
      <p class="nes-text is-disabled text-center pb-4">
        Informações sobre o estado de saúde do Roz<br>
      </p>
    </header>
    <main class="md:mx-24 flex flex-col gap-4 text-xs md:text-base">
      <div class="text-center">
        <p class="nes-text is-success" @click="doRefresh(true)">
          Atualizando em {{ seconds }} segundo{{ seconds !== 1 ? 's' : '' }}.
        </p>
        <button
          type="button"
          class="nes-btn is-warning mt-4"
          :class="{ 'is-disabled': !enableNotificationButton }"
          :disabled="!enableNotificationButton"
          :title="serviceWorkerReady ? undefined : 'Notificações não suportadas neste dispositivo'"
          @click="toggleNotifications"
        >
          {{ notificationsButtonText }}
        </button>
      </div>
      <LoadingContainer :status dark>
        <template #pending>
          <p class="text-center nes-text is-warning">
            Carregando updates...
          </p>
        </template>

        <template #error>
          <p class="text-center nes-text is-error">
            {{ error }}
          </p>
        </template>

        <template #default>
          <div class="flex flex-col gap-4">
            <UpdateCard
              v-for="post of posts"
              :id="post.recordId"
              :key="post.recordId"
              dark
              rounded
              :post
              :title="getTitle(post)"
              :title-link="`/updates/${post.recordId}`"
            />
          </div>
        </template>
      </LoadingContainer>
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
