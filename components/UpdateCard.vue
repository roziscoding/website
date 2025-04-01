<script setup lang="ts">
import type { EnrichedPost } from '~/composables/posts'
import { useLikeStore } from '~/stores/likedPosts'

const props = withDefaults(defineProps<{
  post: EnrichedPost
  rounded?: boolean
  title?: string
  titleLink?: srting
  newTab?: boolean
}>(), {
  rounded: false,
  newTab: false,
})

const images = computed(() => {
  const embed = props.post.embed
  if (!embed)
    return undefined
  return embed.media?.images ?? embed.images ?? undefined
})

const articleClasses = computed(() => {
  const classes: string[] = []

  if (images.value?.length) {
    classes.push('flex', 'flex-col', 'gap-4', 'items-center')
  }

  if (props.rounded)
    classes.push('is-rounded')
  if (props.title)
    classes.push('with-title')

  return classes
})
const likeStore = useLikeStore()
const isLiked = computed(() => likeStore.isLiked(props.post.recordId))

function toggleLike() {
  if (isLiked.value) {
    return likeStore.dislike(props.post.recordId)
  }

  likeStore.like(props.post.recordId)
}
</script>

<template>
  <article class="nes-container is-dark text-sm md:text-base" :class="articleClasses">
    <component :is="titleLink ? 'a' : 'span'" v-if="title" :href="titleLink" class="title self-start" :target="newTab ? '_blank' : undefined">
      {{ title }}
    </component>
    <div class="flex flex-col gap-4 items-center">
      <template v-if="images && images.length">
        <div class="flex flex-col md:flex-row gap-4">
          <div v-for="image in images" :key="image.thumb" class="border-4 border-white ">
            <img class="max-h-[40vh] md:max-h-[500px] md:max-w-[500px]" :src="image.thumb">
          </div>
        </div>
      </template>
      {{ post.record.text }}
      <button class="nes-btn" @click="toggleLike">
        <i class="nes-icon heart" :class="{ 'is-empty': !isLiked }" />
      </button>
    </div>
  </article>
</template>
