<template>
</template>

<script>
import { watch, toRefs  } from 'vue'

export default {
  name: "TheMetaTags",
  props: ['title', 'description'],
  setup(props) {
    const { title, description } = toRefs(props)
    watch([title, description], () => {
      const metaDescription = document.head.querySelector('meta[name="description"]')
      const metaTitle = document.head.querySelector('title')
      if (!metaTitle) {
        const temp = document.createElement('title')
        temp.innerText = title.value
        document.head.prepend(temp)
      } else metaTitle.innerText = title.value
      if (!metaDescription) {
        const temp = document.createElement('meta')
        temp.name = 'description'
        temp.content = description.value
        document.head.append(temp)
      } else metaDescription.content = description.value
    }, {immediate:true})
    return {}
  },
  render() {},
}
</script>

