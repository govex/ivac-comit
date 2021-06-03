<template>
  <article v-if="page">
    <h1>{{ page.title }}</h1>
    <nuxt-content :document="page" />
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
      page = undefined
    }
    return { page }
  }
}
</script>
