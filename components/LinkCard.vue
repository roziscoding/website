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
    width: 100%;
    margin: 0;
    padding: 0;
}

.link-card {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    background-color: black;
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
    justify-content: flex-start;
    gap: 10px;
}

.link-card-content>.nes-btn {
    margin: 0;
}

.link-card>.nes-avatar {
    margin-right: 10px;
}

a {
    text-decoration: none;
    color: inherit;
}
</style>
