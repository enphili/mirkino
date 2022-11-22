<template>
  <div class="right-row">
    <div class="short-description-title">{{ title }}</div>
    <div class="short-description-text">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: "RightMediaDescription",
  props: {
    title: String,
    description: {
      type: String,
      default: 'краткое описание из жизни актера'
    }
  }
}
</script>
