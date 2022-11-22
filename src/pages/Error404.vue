<template>
  <div class="fullscreen bg-dark text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="not-found-title">
        404
      </div>

      <div class="mk-text-h3" style="opacity:.7">
        Упс... Кажется такой страницы не существует :)
      </div>

      <q-btn
        class="q-mt-xl"
        color="accent"
        text-color="white"
        unelevated
        to="/"
        label="На главную"
        no-caps
      />
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
    useMeta(metaData)
    return {}
  },

  components: {}
})
</script>
