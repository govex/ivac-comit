export default {

  // bootstrap configuration
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    html: {
      minify: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    }
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/comit'
  ],

  generate: {
    fallback: true,
    html: {
      minify: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    },
    devtools: true
  },

  // google analytics configuration
  'google-gtag': {
    id: process.env.GOOGLE_GTAG_ID || 'G-FD6EH13JDD',
    config: {
      anonymize_ip: true, // anonymize IP
      send_page_view: false, // might be necessary to avoid duplicated page track on page reload
      linker: {
        domains: ['www.comitglobal.org']
      }
    },
    debug: false, // enable to track in dev mode
    disableAutoPageTrack: false // disable if you don't want to track each page route with router.afterEach(...).
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'COMIT: Covid-19 Maternal Immunization Tracker',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' }
    ]
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://github.com/nuxt-community/google-gtag-module
    '@nuxtjs/google-gtag'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/getMostRecentOrPermissivePolicy.js',
    '~/plugins/listSortComparer.js',
    '~/plugins/getVaccineRecommendationsFromAuthority.js',
    '~/plugins/reconstructReferences.js'
    // '~plugins/vue-tippy.js'
  ],

  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        path: '/pregnancy',
        redirect: '/explore/public-health-authorities/pregnancy'
      })
      routes.push({
        path: '/lactation',
        redirect: '/explore/public-health-authorities/lactation'
      })
    }
  },

  // Target: https://go.nuxtjs.dev/config-target
  target: 'server'

}
