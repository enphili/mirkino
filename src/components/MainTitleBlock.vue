<template>
  <span v-if="tagline" class="tagline animated fadeInDown">{{ tagline }}</span>
  <h1 class="filmInfo-title-h1 animated fadeInRight">{{ title }}</h1>
  <div>
    <p v-if="originalTitle" class="filmInfo-subtitle animated fadeInLeft">{{ originalTitle }}</p>
    <span v-if="mediaType" class="media-type">{{ mediaType }}</span>
  </div>
</template>

<script>
export default {
  name: "MainTitleBlock",
  props: {
    tagline: String,
    title: {
      type: String,
      required: true
    },
    originalTitle: String,
    mediaType: String
  }
}
</script>

