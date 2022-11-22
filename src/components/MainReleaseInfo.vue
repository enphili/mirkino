<template>
  <div class="release-info">

    <div class="age-runtime-wrap">
      <div v-if="isMediaInfo" class="age-limit">{{ certification }}</div>
      <div class="runtime" :style=" isMediaInfo ? '' : {marginLeft: 0} ">{{ runtime }}</div>
      <div class="release-date" :style=" isMediaInfo ? '' : {marginLeft: 10 + 'px'} ">
            <span
              v-if="isMediaInfo"
              v-for="(country, index) in productionCountries"
              :key="index"
            >
              {{ country }}{{index === productionCountries.length - 1 ? ': ' : ', '}}
            </span>
            <span v-else>{{ placeOfBirth }}{{ '.' }}</span>
        <span v-if="isMediaInfo" class="year">{{ year ? year + ' год' : 'Дата выхода неизвестна' }}</span>
        <span v-else class="year">{{ ' ' }}{{ year ? year : 'Дата рождения не указана' }}</span>
      </div>
    </div>

    <div class="tags" v-if="isMediaInfo">
      <q-icon name="tag" style="font-size: 2em;"/>
      <router-link
         v-for="(tag, index) in tags"
         :key="tag.id"
         :to="{name: 'mediaByTags', params: {genresId: tag.id, genresName: tag.name, mediaType}}"
      >
        {{ tag.name.toLowerCase() }}{{ index === tags.length - 1 ? '' : ', ' }}
      </router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: "MainReleaseInfo",
  props: {
    isMediaInfo: {
      type: Boolean,
      default: true
    },
    certification: {
      type: String,
      default: 'н/д'
    },
    runtime: String,
    productionCountries: Array,
    year: String,
    tags: Array,
    placeOfBirth: String,
    homepage: String,
    mediaType: String
  }
}
</script>
