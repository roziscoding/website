<script setup lang="ts">
import type { Link } from '~/shared/link'

const props = defineProps<{
  link: Link
}>()

const url = useRequestURL()
const href = computed(() => `${url.origin}/${props.link.id}`)

const language = useState<'pt' | 'en'>('language', () => 'pt')
</script>

<template>
  <article class="h-full">
    <NesCard class="h-full">
      <a class="h-full" :href="href" target="_blank">
        <RandomColorText>
          <h3>{{ link.title }}</h3>
        </RandomColorText>
        <p>{{ link.description[language] }}</p>
      </a>
    </NesCard>
  </article>
</template>
