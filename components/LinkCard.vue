<script setup lang="ts">
import type { Link } from '~/shared/link';

const props = defineProps<{
    link: Link
}>()

const url = useRequestURL()
const href = computed(() => `${url.origin}/${props.link.id}`)

const language = useState<'pt' | 'en'>('language', () => 'pt')
</script>

<template>
    <article>
        <NesCard class="link-card">
            <a class="link-card-content" :href="href" target="_blank">
                <RandomColorText>
                    <h3>{{ link.title }}</h3>
                </RandomColorText>
                <p>{{ link.description[language] }}</p>
            </a>
        </NesCard>
    </article>
</template>

<style scoped>
article {
    height: 100%;
}

.link-card {
    height: 100%;
}

.link-card:hover {
    color: #212529;
    text-decoration: none;
    background-color: #e7e7e7;
}

.link-card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
}

a {
    text-decoration: none;
    color: inherit;
}
</style>
