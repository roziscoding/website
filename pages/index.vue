<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'
import { links } from '~/shared/link'

const language = useState<'pt' | 'en'>('language', () => 'pt')

const bioCopies = {
  en: 'Backend by trade, frontend by hobby.',
  pt: 'Backend por profissão, frontend por hobby.',
}

const bio = computed(() => bioCopies[language.value])

defineOgImageComponent('Regular', {
  title: 'Rogério Munhoz',
  description: bioCopies.pt,
  image: '/avatar.png',
})

useSeoMeta({
  title: 'Rogério Munhoz',
  ogTitle: 'Rogério Munhoz',
  description: bio.value,
  ogDescription: bio.value,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <main class="flex flex-col justify-center items-center container gap-10 mx-auto mt-10">
    <Analytics />
    <img
      id="avatar"
      src="/avatar.png"
      alt="Roz.Ninja"
      class="w-60 border-4 border-white border-solid"
    >
    <div id="bio">
      <RandomColorText class="text-center">
        <h1 class="nes-text text-xl">
          Rogério Munhoz
        </h1>
      </RandomColorText>
      <p class="nes-text is-disabled text-center">
        {{ bio }}
      </p>
    </div>
    <div id="links" class="grid md:grid-cols-2 grid-cols-1 gap-4 auto-rows-fr">
      <LinkCard v-for="link in links" :key="link.id" :link="link" />
    </div>
  </main>
  <footer class="nes-text is-disabled text-center mt-10">
    <label>
      <input
        v-model="language" type="radio" class="nes-radio" name="language" value="pt"
        :checked="language === 'pt'"
      >
      <span>Português</span>
    </label>
    <label>
      <input
        v-model="language" type="radio" class="nes-radio" name="language" value="en"
        :checked="language === 'en'"
      >
      <span>English</span>
    </label>
  </footer>
</template>
