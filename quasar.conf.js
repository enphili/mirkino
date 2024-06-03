const { configure } = require('quasar/wrappers')

module.exports = configure(function (ctx) {
  return {
    supportTS: false,

    boot: [
      'axios',
      'scrollThreshold'
    ],

    css: [
      'app.sass'
    ],

    extras: [
      'ionicons-v4',
      'material-icons'
    ],

    build: {
      vueRouterMode: 'history',
      env: require('dotenv').config().parsed
    },

    devServer: {
      https: false,
      port: 8000,
      open: true,
    },

    framework: {
      lang: 'ru',
      plugins: [
        'Notify'
      ],
      config: {
        notify: {
          position: 'top',
          timeout: 3000
        }
      }
    },

    animations: [
      'fadeInUpBig'
    ],

    ssr: {
      pwa: false,
      prodPort: 3000,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      middlewares: [
        ctx.prod ? 'compression' : '',
        'render'
      ]
    },

    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {},
      manifest: {
        name: `Мир кино`,
        short_name: `Мир кино`,
        description: `Сайт по поиску фильмов просмотра информации о фильме актерах и просмотра трейлеров`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: { },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      bundler: 'packager',

      packager: {  },

      builder: {
        appId: 'mir-kino'
      }
    }
  }
})
