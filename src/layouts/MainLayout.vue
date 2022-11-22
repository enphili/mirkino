<template>
  <q-layout view="lhr lpR lFf" class="bg-dark">
    <q-header class="transparent q-pb-md">
      <q-toolbar class="q-mt-md">
        <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        <q-toolbar-title shrink class="text-weight-black app-title">
            <router-link to="/">
              МирКино
            </router-link>
          </q-toolbar-title>
        <search-form></search-form>
        <auth-info></auth-info>
      </q-toolbar>
    </q-header>

    <q-drawer
      overlay
      behavior="mobile"
      v-model="leftDrawerOpen"
      show-if-above
      dark
    >
      <q-list style="height: 100%; display: flex; flex-direction: column">
        <q-item-label header class="text-bold text-h6">Меню</q-item-label>

        <div style="margin-right: 10px; margin-left: 10px">
          <q-item-label>
            <EssentialLink
              v-for="link in MenuLinks"
              :key="link.title"
              v-bind="link"
            />
          </q-item-label>
        </div>

        <q-item-label header style="margin-top: auto">
          <EssentialLink
            v-for="link in footerLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-item-label>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import AuthInfo from 'components/AuthInfo'
import SearchForm from 'components/SearchForm'
import EssentialLink from 'components/EssentialLink'
import { defineComponent, ref } from 'vue'
import {useStore} from 'vuex'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const $store = useStore()
    const years = []
    const numberOfYears = 10

    for(let i=0; i<numberOfYears; i++) {
      years.push((new Date().getFullYear()) - i)
    }

    $store.commit('primaryreleaseyear/setPrimaryReleaseYear', years[0])

    return {
      leftDrawerOpen: ref(false),
      MenuLinks: [
        {
          title: 'Сейчас в кино',
          icon: 'movie',
          routerName: {name: 'nowplaying'},
        },
        {
          title: 'Самые популярные фильмы',
          icon: 'stars',
          routerName: {name: 'popularity'},
        },
        {
          title: 'Лучшие фильмы',
          isYear: true,
          icon: 'thumb_up',
          years: years
        },
        {
          title: 'Скоро выйдут на экран',
          icon: 'av_timer',
          routerName: {name: 'upcoming'},
        },
      ],
      footerLinks: [
        {
          title: 'Разработка',
          caption: 'webfldev.ru',
          icon: 'code',
          link: 'https://webfldev.ru',
          isTargetBlank: true,
          titleFontSize: 0.65,
          captionFontSize: 0.52
        },
      ],
    }
  },

  components: { SearchForm, AuthInfo, EssentialLink }
})
</script>
