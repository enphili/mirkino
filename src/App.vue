<template>
  <component :is="layout + '-layout'" v-if="layout"></component>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from 'layouts/MainLayout'
import AuthLayout from 'layouts/AuthLayout'
import OfficeLayout from 'layouts/OfficeLayout'

export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute()
    console.log('test')
    return {
      layout: computed(() => route.meta.layout)
    }
  },

  components: { MainLayout, AuthLayout, OfficeLayout }
})
</script>
