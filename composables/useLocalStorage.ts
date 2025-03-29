export function useLocalStorage<T>(key: string, defaultValue: T) {
  if (import.meta.server) return ref(false)
  const existingState = localStorage.getItem(key)
  if (!existingState) localStorage.setItem(key, JSON.stringify(defaultValue))
  const state = useState(key, () => existingState ? JSON.parse(existingState) : defaultValue)

  watch(state, (value) => {
    localStorage.setItem(key, JSON.stringify(value))
  })

  return state
}