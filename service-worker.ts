/* eslint-disable no-console */
/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope

const channel = new BroadcastChannel('sw-messages')

self.addEventListener('install', (event) => {
  console.debug('Service worker installed')
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  console.debug('Service worker activated')
  event.waitUntil(self.clients.claim())
})

// Register event listener for the 'push' event.
self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }

  try {
    const data = event.data.json()

    // Show notification immediately without waiting for clients
    const notificationOptions = {
      body: data.message,
      tag: data.tag,
      data: { url: `/updates/${data.tag}` },
    }

    // Use Promise.resolve() to ensure we're not waiting for any async operations
    event.waitUntil(
      self.registration.showNotification(data.title, notificationOptions),
    )

    channel.postMessage({ type: 'new-post' })
  }
  catch (error) {
    console.error('Error handling push event:', error)
  }
})

self.addEventListener('notificationclick', (event) => {
  // Get the URL from the notification data
  const url = event.notification.data?.url || `/updates/${event.notification.tag}`

  event.notification.close()

  if (self.clients.openWindow) {
    event.waitUntil(
      self.clients.openWindow(url),
    )
  }
})
