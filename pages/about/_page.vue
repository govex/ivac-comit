<template>
  <article v-if="page">
    <b-row>
      <h1>{{ page.title }}</h1>
      <nuxt-content :document="page" />
    </b-row>
  </article>
  <div v-else>
    Not found
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const pageName = params.page
    let page
    try {
      page = await $content(pageName).fetch()
      return { page }
    } catch (err) {
      return { page: { title: 'Not found', description: 'Not found' } }
    }
  },
  head () {
    return {
      title: this._pageTitle,
      meta: [
        { hid: 'description', name: 'description', content: this._pageDescription },
        { hid: 'twitter:title', name: 'twitter:title', content: this._pageTitle },
        { hid: 'twitter:description', name: 'twitter:description', content: this._pageDescription },
        { hid: 'twitter:image', name: 'twitter:image', content: this._pageImage },
        { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: this._pageTitle },
        { hid: 'og:title', property: 'og:title', content: this._pageTitle },
        { hid: 'og:description', property: 'og:description', content: this._pageDescription },
        { hid: 'og:url', property: 'og:url', content: this._pageUrl },
        { hid: 'og:image', property: 'og:image', content: this._pageImage },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: this._pageImage },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this._pageTitle }
      ]
    }
  },
  computed: {
    _pageTitle () {
      return this.page.title
    },
    _pageDescription () {
      return this.page.description
    },
    _pageImage () {
      return this.page.image || 'https://www.comitglobal.org/img/comit-dark-background.png'
    },
    _pageUrl () {
      return `https://www.comitglobal.org${this.$route.path}`
    }
  }
}
</script>
