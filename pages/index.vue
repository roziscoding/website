<script setup lang="ts">
import { links } from '~/shared/link';

const language = useState<'pt' | 'en'>('language', () => 'pt')

const bioCopies = {
    en: 'Backend by trade, frontend by hobby.',
    pt: 'Backend por profissão, frontend por hobby.'
}

const bio = computed(() => bioCopies[language.value])
</script>
<template>
    <main class="flex-container is-column">
        <img class="avatar" src="https://gravatar.com/avatar/77dfdf45d13a8352770cf6b1938d3b07?s=400&d=robohash&r=x"
            alt="Roz.Ninja" />
        <div class="bio">
            <RandomColorText>
                <h1 class="nes-text name">Rogério Munhoz</h1>
            </RandomColorText>
            <p class="nes-text is-disabled">
                {{ bio }}
            </p>
        </div>
        <div class="flex-container" id="links-container">
            <LinkCard v-for="link in links" :link="link" />
        </div>
    </main>
    <footer class="nes-text is-disabled flex-container footer">
        <label>
            <input type="radio" class="nes-radio" name="language" value="pt" v-model="language"
                :checked="language === 'pt'" />
            <span>Português</span>
        </label>
        <label>
            <input type="radio" class="nes-radio" name="language" value="en" v-model="language"
                :checked="language === 'en'" />
            <span>English</span>
        </label>
    </footer>
</template>

<style>
.flex-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding-left: 40px;
    padding-right: 40px;
}

.flex-container.is-column {
    flex-direction: column;
}

#links-container>* {
    flex-basis: 50%;
}

.avatar {
    margin-top: 40px;
    border: 4px solid white;
    padding: 10px;
    width: 250px;
}

.bio {
    font-size: 1.2rem;
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: center;
}

.bio p {
    margin-top: 20px;
}

.name {
    font-size: 1.5rem;
}

footer {
    text-align: center;
    bottom: 0;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
}

.flex-container.footer {
    align-items: baseline;
    justify-content: center;
}

.footer p {
    margin-right: 10px;
}

.footer label {
    margin-right: 10px;
}

main {
    min-height: calc(100vh - 100px);
}
</style>