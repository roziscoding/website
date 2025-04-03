<script setup lang="ts">
const props = withDefaults(defineProps<{
  status: 'pending' | 'idle' | 'error' | 'success'
  empty?: boolean
  hasTitle?: boolean
  dark?: boolean
  rounded?: boolean
  persistent?: boolean
}>(), {
  empty: false,
  hasTitle: false,
  dark: false,
  rounded: false,
  persistent: false,
})

const isSuccess = computed(() => unref(props.status) === 'success')
const containerClasses = computed(() => {
  const classes: string[] = []

  if (props.dark)
    classes.push('is-dark')
  if (props.rounded)
    classes.push('is-rounded')
  if (props.hasTitle)
    classes.push('with-title')

  if (!isSuccess.value || props.empty)
    classes.push('nes-container', 'text-center')

  return classes
})
</script>

<template>
  <div :class="containerClasses">
    <slot v-if="status === 'pending'" name="pending" />
    <slot v-if="status === 'idle'" name="idle" />
    <slot v-if="status === 'error'" name="error" />
    <slot v-if="isSuccess && empty" name="empty" />
    <slot v-if="isSuccess || persistent" />
  </div>
</template>
