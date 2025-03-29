/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope

const channel = new BroadcastChannel('sw-messages')

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
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
      data: { url: `/updates#${data.tag}` },
    }

    // Use Promise.resolve() to ensure we're not waiting for any async operations
    event.waitUntil(
      self.registration.showNotification(data.title, notificationOptions),
    )
  }
  catch (error) {
    console.error('Error handling push event:', error)
  }
})

self.addEventListener('notificationclick', (event) => {
  // Get the URL from the notification data
  const url = event.notification.data?.url || `/updates#${event.notification.tag}`

  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
    }).then((clientList) => {
      // Post message to any open clients
      channel.postMessage({ type: 'new-post', postUrl: url })

      // Try to focus an existing window
      for (const client of clientList) {
        if (client.url.includes('/updates') && 'focus' in client) {
          return client.focus()
        }
      }

      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    }),
  )
})
