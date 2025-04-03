<script setup lang="ts">
const visible = defineModel('visible', { default: false })

function close() {
  visible.value = false
}
</script>

<template>
  <div class="nes-container is-dark flex flex-col gap-4 text-center" v-if="visible">
    <p class="nes-text is-primary">
      Ativando notificações no iOS
    </p>
    <p>É claro que a apple não podia simplificar isso, então, pra ativar notificações no iOS, você precisa instalar a página como um aplicativo</p>
    <p>Pra fazer isso, clique no botão de compartilhar página do seu navegador (<span class="octicon--share-24" />), e escolha a opção "Adicionar à tela de início"</p>
    <p>Isso criará um ícone dessa página na sua home screen</p>
    <p>Abrindo a página por lá, o botão de ativar notificações deve funcionar normalmente</p>
    <menu class="dialog-menu">
      <button class="nes-btn" @click="close">
        Fechar
      </button>
    </menu>
  </div>
</template>

<style scoped>
.octicon--share-24 {
  display: inline-block;
  width: 24px;
  height: 24px;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5.5 9.75v10.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V9.75a.25.25 0 0 0-.25-.25h-2.5a.75.75 0 0 1 0-1.5h2.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 18.25 22H5.75A1.75 1.75 0 0 1 4 20.25V9.75C4 8.784 4.784 8 5.75 8h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25m7.03-8.53l3.25 3.25a.749.749 0 0 1-.326 1.275a.75.75 0 0 1-.734-.215l-1.97-1.97v10.69a.75.75 0 0 1-1.5 0V3.56L9.28 5.53a.75.75 0 0 1-1.042-.018a.75.75 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
</style>
