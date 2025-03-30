<script setup lang="ts">
const props = defineProps<{
  image?: string
  title: string
  description: string
  subheader?: string
  hideOrigin?: boolean
}>()

const subheader = computed(() => props.subheader ?? 'roz.ninja')
const colors = [
  'primary',
  'success',
  'warning',
  'error',
]
const randomColor = colors[Math.floor(Math.random() * colors.length)]
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid  border-[12px] bg-gray-50">
    <div class="flex items-start justify-start h-full">
      <div class="flex flex-col gap-10 justify-between w-full h-full p-20 font-black text-left">
        <div class="flex flex-row items-end justify-start">
          <div class="mr-10">
            <img v-if="image" :src="image" class="size-[280px] border-8" :class="` border-${randomColor}`">
          </div>
          <h1 class="text-[80px] flex-1" :class="`text-${randomColor}`">
            {{ title }}
          </h1>
        </div>
        <div>
          <h2>
            {{ description }}
          </h2>
          <h3 v-if="!hideOrigin">
            {{ subheader }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>
