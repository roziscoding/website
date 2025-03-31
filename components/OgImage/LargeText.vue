<script async setup lang="ts">
defineProps<{
  title?: string
  text: string | (() => Promise<string> | string)
}>()

const colors = [
  'primary',
  'success',
  'warning',
  'error',
]
const randomColor = colors[Math.floor(Math.random() * colors.length)]
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid  border-[12px] bg-neutral-900">
    <div class="flex items-start justify-start h-full">
      <div class="flex flex-col gap-10  w-full h-full p-20 font-black text-left">
        <h1 v-if="title" class="text-xxl flex-1" :class="`text-${randomColor}`">
          {{ title }}
        </h1>
        <h2 class="text-3xl text-gray-50">
          {{ text }}
        </h2>
      </div>
    </div>
  </div>
</template>
