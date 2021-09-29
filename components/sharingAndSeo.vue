<template>
  <b-button-group class="bg-secondary align-items-center">
    <b-button variant="outline-primary" disabled>
      Share
    </b-button>
    <b-button v-b-popover.bottom.hover="'Share this page via Twitter'" variant="outline-primary" class="ms-1" :href="twitterUrl" target="_blank">
      <b-icon-twitter />
    </b-button>
    <b-button v-b-popover.bottom.hover="'Share this page via Facebook'" variant="outline-primary" class="ms-1" :href="facebookUrl" target="_blank">
      <b-icon-facebook />
    </b-button>
    <b-button v-b-popover.bottom.hover="'Share this page via email'" variant="outline-primary" class="ms-1" :href="mailUrl" target="_blank">
      <b-icon-envelope-open />
    </b-button>
    <b-button v-b-popover.bottom.hover="clipboardHoverText" variant="outline-primary" class="ms-1" @click="copyPageLink">
      <b-icon-link />
    </b-button>
  </b-button-group>
</template>

<script>
export default {
  data () {
    return {
      clipboardHoverText: 'Copy to clipboard'
    }
  },
  computed: {
    facebookUrl () {
      return `https://www.facebook.com/sharer.php?p[url]=https://www.comitglobal.org${this.$route.fullPath}`
    },
    mailUrl () {
      return `mailto:?subject=${this.title}&body=https://www.comitglobal.org${this.$route.fullPath}`
    },
    twitterUrl () {
      return `https://twitter.com/intent/tweet?url=https://www.comitglobal.org${this.$route.fullPath}`
    }
  },
  methods: {
    copyPageLink () {
      navigator.clipboard.writeText(`https://comitglobal.org${this.$route.fullPath}`)
      this.clipboardHoverText = 'Copied!'
      setTimeout(() => {
        this.clipboardHoverText = 'Copy link'
      }, 5000)
    }
  }
}
</script>
