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
  head () {
    const _pageTitle = 'Covid-19 Maternal Immunization Tracker'
    const _pageDescription = 'The COVID-19 Maternal Immunization Tracker (COMIT) provides a global snapshot of public health policies that influence access to COVID-19 vaccines for pregnant and lactating people. Through maps, tables, and country profiles, COMIT provides regularly updated information on global and country level policies as they respond to the dynamic state of the pandemic and emerging evidence.'
    const _pageImage = 'https://www.comitglobal.org/img/comit-dark-background.png'
    const _pageUrl = 'https://www.comitglobal.org/'
    return {
      title: _pageTitle,
      titleTemplate: '%s | COMIT',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: _pageDescription },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:site', name: 'twitter:site', content: '@johnshopkins' },
        { hid: 'twitter:title', name: 'twitter:title', content: _pageTitle },
        { hid: 'twitter:description', name: 'twitter:description', content: _pageDescription },
        { hid: 'twitter:image', name: 'twitter:image', content: _pageImage },
        { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: _pageTitle },
        { hid: 'og:title', property: 'og:title', content: _pageTitle },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:description', property: 'og:description', content: _pageDescription },
        { hid: 'og:url', property: 'og:url', content: _pageUrl },
        { hid: 'og:image', property: 'og:image', content: _pageImage },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: _pageImage },
        { hid: 'og:image:alt', property: 'og:image:alt', content: _pageTitle }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
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
  target: 'server',

  render: {
    static: {
      // Add CORS header to static files.
      setHeaders (res) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET')
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept'
        )
      }
    }
  }
}
