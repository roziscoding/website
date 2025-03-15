<script setup lang="ts">
const colors = ['primary', 'success', 'warning', 'error']
const randomColor = colors[Math.floor(Math.random() * colors.length)]
</script>

<template>
  <span class="nes-text" :class="`is-${randomColor}`">
    <slot />
  </span>
</template>
