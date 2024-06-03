<template>
  <div class="bg-main-img">
    <q-img
      :src="url"
      class="full-parent"
      fit="contain"
      no-spinner
      position="50% 0"
      loading="eager"
      :alt="`Постер к ${mediaType} ${title}`"
    />
  </div>
</template>

<script>
export default {
  name: "MainBgImage",
  props: {
    url: {
      type: String
    },
    title: String,
    mediaType: String
  }

}
</script>

<style lang="sass">
.full-parent
  width: 100%
  height: 100%
</style>
