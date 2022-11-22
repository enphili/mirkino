<template>
  <div v-if="isVisible" class="ja-lightbox" @click="closeLightbox">
          <div class="ja-overlay"></div>
          <div class="ja-outerwrap">
            <div class="ja-outerwrap__ja-wraper ja-wraper">
              <button type="button" title="Close" class="ja-wraper__ja-closebutton ja-closebutton">×</button>
              <div class="ja-outerwrap__ja-contentout ja-contentout">

                <div class="ja-contentout__ja-content ja-content">

                <transition name="ja-lightbox-slide-change" mode="out-in">
                <div class="ja-content__ja-iframeblock ja-iframeblock">
                  <transition name="ja-lightbox-slide-change" mode="out-in">
                    <iframe
                      class="ja-iframeblock__ja-iframe ja-iframe"
                      :src="getVideoUrl(imgIndex)"
                      :key="imgIndex"
                      allowfullscreen>
                    </iframe>
                  </transition>
                </div>
              </transition>
          </div>

          <div class="ja-contentout__ja-navigation ja-navigation">
            <button
              class="ja-navigation__ja-prevbtn ja-prevbtn ja-btn"
              title="Previous"
              v-show="(imgIndex - 1 >= 0) && (items.length > 1)"
              @click="onPrevClick"
            ></button>
            <button
              class="ja-navigation__ja-nextbtn ja-nextbtn ja-btn"
              title="Next"
              v-show="(imgIndex + 1 < items.length) && (items.length > 1)"
              @click="onNextClick"
            ></button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'

export default {
  name: "JustALightbox",

  emits: ['close'],

  props: {

    initIndex: {
      type: Number,
      require: true
    },

    items: {
      type: Array,
      require: true
    },

    youtubeCookies: {
      type: Boolean,
      default: true
    }
  },

  setup(props, {emit}) {
    const isVisible = ref(false)
    const imgIndex = ref(props.initIndex)
    const windowSize = reactive({ height: '', width: '' })

    //watch
    watch(() => props.initIndex, (newIndex, oldIndex) => {
      if (newIndex != null) {
        isVisible.value = true
        imgIndex.value = newIndex
      }
    })

    // methods
    const getWindowSize = () => {
      windowSize.height = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      windowSize.width = 'innerWidth' in window ? window.innerWidth : document.documentElement.offsetWidth
    }

    const close = () => {
      isVisible.value = false
      imgIndex.value = null
      emit('close')
    }

    const closeLightbox = e => {
      const elementsnotclose = '.ja-imgwrapper__ja-caption, .ja-caption, .ja-navigation__ja-nextbtn, .ja-nextbtn, .ja-btn, .ja-navigation__ja-prevbtn, .ja-prevbtn, .ja-contentout__ja-content, .ja-content, .ja-content__ja-imgwrapper, .ja-imgwrapper, .ja-imgwrapper__ja-img, .ja-img, .ja-contentout__ja-content, .ja-content, .ja-content__ja-iframeblock, .ja-iframeblock, .ja-iframeblock__ja-iframe, .ja-iframe'
      if (!e.target.matches(elementsnotclose)) close()
    }

    const getVideoUrl = idx => {
      if (props.items.length === 0) return
      if (props.items[idx].site === 'YouTube') {
        if (props.youtubeCookies) return `https://www.youtube.com/embed/${props.items[idx].key}?rel=0`
        return `https://www.youtube-nocookie.com/embed/${props.items[idx].key}?rel=0`
      }
      if (props.items[idx].site === 'Vimeo') {
        return `https://player.vimeo.com/video/${props.items[idx].key}?title=1&portrait=0`
      }
    }

    const onPrevClick = () => {
      if (imgIndex.value - 1 >= 0) --imgIndex.value
    }

    const onNextClick = () => {
      if (imgIndex.value + 1 < props.items.length) ++imgIndex.value
    }

    const changeItemByKeyboard = e => {
      if (isVisible.value) {
        if (e.code === 'ArrowRight') onNextClick()
        if (e.code === 'ArrowLeft') onPrevClick()
      }
    }

    // hooks
    onMounted(() => {
      window.addEventListener('resize', getWindowSize)
      window.addEventListener('keydown', changeItemByKeyboard)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', getWindowSize)
      window.removeEventListener('keydown', changeItemByKeyboard)
    })

    return { isVisible, closeLightbox, windowSize, imgIndex, onPrevClick, onNextClick, getVideoUrl }
  }
}
</script>

