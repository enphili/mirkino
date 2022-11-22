const routes = [
  {
    path: '/',
    name: 'PageIndex',
    component: () => import('../pages/Index.vue'),
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/movie/:mediaID/:mediaTitle',
    name: 'movie',
    component: () => import('../pages/Movie'),
    props: true,
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/serials/:mediaID/:mediaTitle',
    name: 'serials',
    component: () => import('../pages/Serials'),
    props: true,
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/:mediaID/:mediaTitle/season/:seasonNumber',
    name: 'season',
    component: () => import('../pages/Season'),
    props: true,
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/:mediaID/:mediaTitle/season/:seasonNumber/episode/:episodeNumber/:episodTitle',
    name: 'episode',
    component: () => import('../pages/Episode'),
    props: true,
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/actors/:personId/:actorName',
    name: 'actors',
    component: () => import('../pages/Actors'),
    props: true,
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/search/:searchText',
    name: 'search',
    component: () => import('../pages/SearchResults'),
    props: true,
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/mediabytags/:mediaType/:genresId/:genresName',
    name: 'mediaByTags',
    component: () => import('../pages/MediaByTags'),
    props: true,
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/nowplaying',
    name: 'nowplaying',
    component: () => import('../pages/NowPlaying'),
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/popularity',
    name: 'popularity',
    component: () => import('../pages/MostPopularity'),
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/primaryreleaseyear/:year',
    name: 'primaryreleaseyear',
    component: () => import('../pages/PrimaryReleaseYear'),
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/upcoming',
    name: 'upcoming',
    component: () => import('../pages/UpcomingMovies'),
    meta: {
      layout: 'main',
      auth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/Login'),
    meta: {
      layout: 'auth',
      auth: false
    }
  },
  {
    path: '/privateoffice',
    name: 'privateoffice',
    component: () => import('../pages/PrivateOffice.vue'),
    meta: {
      layout: 'office',
      auth: true
    }
  },
  {
    path: '/relogin',
    name: 'relogin',
    component: () => import('../pages/auth/ReLogin'),
    meta: {
      layout: 'auth',
      auth: false
    }
  },
  {
    path: '/registry',
    name: 'registry',
    component: () => import('../pages/auth/Registry.vue'),
    meta: {
      layout: 'auth',
      auth: false
    }
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import('../pages/auth/Forget.vue'),
    meta: {
      layout: 'auth',
      auth: false
    }
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error404',
    component: () => import('../pages/Error404.vue'),
    meta: {
      layout: 'main',
      auth: false
    }
  }
]

export default routes
