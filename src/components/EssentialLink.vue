<template>
  <q-item
    clickable
    v-ripple
    tag="a"
    active-class="text-accent"
    :target="isTargetBlank ? '_blank' : ''"
    :href="link"
    :to="routerName"
    @click="handleClick"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label :style="{fontSize: titleFontSize + 'em'}">{{ title }}</q-item-label>
      <q-item-label v-if="caption" :style="{fontSize: captionFontSize + 'em'}">{{ caption }}</q-item-label>
      <q-item-label v-if="isYear" class="row" style="margin: 0">
        <q-select
          dark
          dense
          options-dense
          color="accent"
          transition-show="jump-up"
          transition-hide="jump-up"
          borderless
          hide-bottom-space
          class="selectYear"
          :readonly="false"
          v-model="year"
          :options="years"
          :display-value="year"
          @update:model-value="updateYear"
        />
        &nbsp;&nbsp;года
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import {defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    link: String,
    icon: {
      type: String,
      default: ''
    },
    titleFontSize: {
      type: Number,
      default: 1
    },
    captionFontSize: {
      type: Number,
      default: 0.8
    },
    isYear: {
      type: Boolean,
      default: false
    },
    routerName: Object,
    isTargetBlank: {
      type: Boolean,
      default: false
    },
    years: {
      type: Array,
      default: () => []
    }
  },

  setup (props) {
    const $store = useStore()
    const router = useRouter()
    const year = ref(props.years.length > 0 ? props.years[0] : '')

    const updateYear = () => $store.commit('primaryreleaseyear/setPrimaryReleaseYear', year.value)

    const handleClick = e => {
      if (props.isYear && !e.target.closest('label.selectYear')) {
        e.preventDefault()
        router.push({name: 'primaryreleaseyear', params: {year: year.value}})
      }
    }

    return { year, updateYear, handleClick}
  }
})
</script>
