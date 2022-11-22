import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

import currentUser from './currentuser'
import popularMedia from './popularmedia'
import nowplaying from './nowplaying'
import mostpopularmedia from './mostpopularmedia'
import primaryreleaseyear from './primaryreleaseyear'

export default store(function () {
  return createStore({
    modules: {
      popularMedia,
      currentUser,
      nowplaying,
      mostpopularmedia,
      primaryreleaseyear
    },
    strict: process.env.DEBUGGING
  })
})
