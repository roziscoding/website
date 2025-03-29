<script>
if (!import.meta.server && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw',
  )
}
</script>

<template>
  <div class="app-container">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
