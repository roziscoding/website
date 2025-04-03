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
    <p>Pra fazer isso, clique no botão de compartilhar página do seu navegador (<ShareIcon />), e escolha a opção "Adicionar à tela de início"</p>
    <p>Isso criará um ícone dessa página na sua home screen</p>
    <p>Abrindo a página por lá, o botão de ativar notificações deve funcionar normalmente</p>
    <menu class="dialog-menu">
      <button class="nes-btn" @click="close">
        Fechar
      </button>
    </menu>
  </div>
</template>

