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
      title: 'COMIT: ' + this.page.title,
      meta: [
        { hid: 'description', name: 'description', content: this.page.description }
      ]
    }
  }
}
</script>
