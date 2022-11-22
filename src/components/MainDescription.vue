<template>
  <div>
    <div class="short-description-title">{{ title }}</div>
    <div class="short-description-text">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: "MainDescription",
  props: {
    description: String,
    title: String
  }
}
</script>

