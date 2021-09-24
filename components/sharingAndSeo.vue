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
  props: {
    title: {
      type: String,
      default: 'This is a title'
    },
    description: {
      type: String,
      default: 'This is a description'
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/350x150'
    }
  },
  data () {
    return {
      clipboardHoverText: 'Copy to clipboard'
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.title
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.description
        },
        {
          hid: 'twitter:image',
          name: 'twitter:image',
          content: this.image
        },
        {
          hid: 'twitter:image:alt',
          name: 'twitter:image:alt',
          content: this.title
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.description
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.image
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: this.image
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: this.title
        }
      ]
    }
  },
  computed: {
    facebookUrl () {
      return `https://www.facebook.com/sharer.php?p[url]=https://www.comitglobal.org${this.$route.fullPath}`
    },
    mailUrl () {
      return `mailto:?subject=${this.title}&body=https://www.comitglobal.org${this.$route.fullPath}`
    },
    showBetaBadge () {
      return process.env.HIDE_BETA_BADGE !== 'true'
    },
    twitterUrl () {
      return `https://twitter.com/intent/tweet?text=${this.title}&url=https://www.comitglobal.org${this.$route.fullPath}`
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
