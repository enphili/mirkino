<template>
  <div class="bg-main-img">
    <q-img
      :src="url"
      style="width: 100%; height: 100%"
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
      type: String,
      required: true
    },
    title: String,
    mediaType: String
  }

}
</script>
