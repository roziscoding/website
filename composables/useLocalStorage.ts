export function useLocalStorage<T>(key: string, defaultValue: T) {
  const state = useState<T>(key, () => defaultValue)
  if (import.meta.server)
    return state

  const existingState = localStorage.getItem(key)
  if (existingState) {
    state.value = JSON.parse(existingState)
  }
  else {
    localStorage.setItem(key, JSON.stringify(defaultValue))
  }

  watch(state, (value) => {
    localStorage.setItem(key, JSON.stringify(value))
  })

  return state
}
