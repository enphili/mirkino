<template>
  <div class="fullscreen bg-dark text-white text-center q-pa-md flex flex-center">
    <div>
      <h1 class="not-found-title">404</h1>

      <p class="mk-text-h3 opacity-07">
        Упс... Кажется такой страницы не существует :)
      </p>

      <div class="btn-container">
        <q-btn
          class="q-mt-xl"
          color="accent"
          text-color="white"
          unelevated
          @click="goBack"
          label="Назад"
          aria-label="Вернуться на шаг назад"
          no-caps
        />
        <q-btn
          class="q-mt-xl"
          color="accent"
          text-color="white"
          unelevated
          to="/"
          label="На главную"
          aria-label="Вернуться на главную"
          no-caps
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

export default defineComponent({
  name: 'Error404',

  setup() {
    const metaData = {
      title: 'Ошибка 404',
      titleTemplate: title => `Мир кино | ${title}`,
      meta: {
        description: {name: 'description', content: 'Страница не найдена т.к. была удалена или ее изначально не существовало '}
      }
    }

    const goBack = () => window.history.go(-2)

    useMeta(metaData)
    return {goBack}
  }
})
</script>

<style lang="sass">
.opacity-07
  opacity: .7
.btn-container
  display: flex
  justify-content: center
  gap: 10px
</style>
