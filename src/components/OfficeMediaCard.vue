<template>
  <q-card
    bordered
    flat
    dark
    class="office-cart cursor-pointer"
    @click="openMedia"
  >
    <q-card-section horizontal>
      <q-img
        class="office-cart-img"
        :src="media.posterPath"
      >
        <template v-slot:error>
          <img :src="require('../assets/img/load-img-error.jpg')" alt="error-load">
        </template>
      </q-img>
      <q-card-section class="bg-dark text-white">
        <p class="text-subtitle2 text-weight-bold office-cart-title">{{ media.title }}</p>
        <div class="type-year">
          <p class="media-type m8-0-0-0">{{ media.type === 'movie' ? 'фильм' : 'сериал' }}</p>
          <p class="m8-0-0-10">{{ media.year }} г.</p>
        </div>
        <div class="type-year">
          <p class="tv-info" v-if="media.seasonNumber">{{ media.seasonNumber }},</p>
          <p class="tv-info" v-if="media.episodeNumber">{{ media.episodeNumber }},</p>
          <p class="tv-info" v-if="media.episodTitle">"{{ media.episodTitle }}"</p>
        </div>
      </q-card-section>
      <q-card-actions class="office-cart-btns">
        <q-btn round flat icon="close" class="text-accent" @click.stop="removeMedia">
          <q-tooltip class="bg-accent">Удалить из списка</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'OfficeMediaCard',
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  emits: ['click', 'remove'],

  setup(props, {emit}) {
    const removeMedia = () =>  emit('remove', props.media.id)
    const openMedia = () => emit('click', props.media, )

    return {removeMedia, openMedia}
  },

}
</script>

<style scoped lang="sass">
.office-cart
  &-title
    margin: 0
  &-img
    height: 140px
    width: 100px
    flex-shrink: 0
  &-btns
    margin-left: auto
    align-items: start
.type-year
  display: flex
  align-items: center
  flex-wrap: wrap
.tv-info
  font-size: 0.89em
  margin: 0 0 0 5px
  white-space: nowrap
.type-year:not(:last-child)
  margin-bottom: 10px
.m8-0-0-0
  margin: 8px 0 0 0
.m8-0-0-10
  margin: 8px 0 0 10px
@media screen and (max-width: 440px)
  .office-cart
    &-img
      display: none
</style>
