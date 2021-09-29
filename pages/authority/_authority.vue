<template>
  <div>
    <template v-if="authority">
      <div class="d-flex flex-row justify-content-between align-items-center">
        <h1>
          {{ authority.name }}
        </h1>
        <span v-if="authority.reviewEvents">Last reviewed on {{ authority.reviewEvents.slice(-1)[0] }}</span>
      </div>
      <div class="w-100 mb-5 align-items-baseline">
        <b-badge variant="success">
          {{ authority.authorityType }}
        </b-badge>
        <span v-for="country of authority.countries" :key="country.id">
          |
          <b-link v-if="country.name === 'Global'" to="/country/global">
            {{ country.name }}
          </b-link>
          <b-link v-else-if="country.iso3166Alpha2Code" :to="`/country/${country.iso3166Alpha2Code.toLowerCase()}`">
            {{ country.name }}
          </b-link>
          <span v-else>{{ country.name }}</span>
        </span>
      </div>

      <h2 class="mt-5">
        Most recent vaccine policy positions
      </h2>
      <AuthorityVaccinePolicies :authority="authority">
        No information available.
      </AuthorityVaccinePolicies>

      <h2 class="mt-5">
        Resources &amp; guidance
      </h2>
      <AuthorityPolicies :policies="authority.policies">
        No information available.
      </AuthorityPolicies>

      <h2 class="mt-5">
        Important links
      </h2>
      <div class="d-flex flex-column justify-content-start align-items-start">
        <div class="w-100 text-truncate">
          <b-link v-if="authority.website1" v-b-popover.hover="'Open this website in a new browser tab'" :href="authority.website1" target="_blank" class="mx-1">
            <b-icon-box-arrow-up-right /> {{ authority.website1 }}
          </b-link>
        </div>
        <div class="w-100 text-truncate">
          <b-link v-if="authority.website2" v-b-popover.hover="'Open this website in a new browser tab'" :href="authority.website2" target="_blank" class="mx-1">
            <b-icon-box-arrow-up-right /> {{ authority.website2 }}
          </b-link>
        </div>
        <div class="w-100 text-truncate">
          <b-link v-if="authority.website3" v-b-popover.hover="'Open this website in a new browser tab'" :href="authority.website3" target="_blank" class="mx-1">
            <b-icon-box-arrow-up-right /> {{ authority.website3 }}
          </b-link>
        </div>
      </div>
      <h4 class="mt-4">
        Legend
      </h4>
      <PolicyPositionsIndicators :displayed-indicators="[1,2,3,4,5,999]" />
    </template>
    <template v-else>
      We couldn't find that authority.
    </template>
  </div>
</template>

<script>
export default {
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
      return `${this.authority ? this.authority.name : 'not found'}`
    },
    _pageDescription () {
      return ''
    },
    _pageImage () {
      return 'https://www.comitglobal.org/img/comit-dark-background.png'
    },
    _pageUrl () {
      return `https://www.comitglobal.org${this.$route.path}`
    },
    authority () {
      const authorityId = this.authorityId === 'who'
        ? 'recFs2GvQUntKmKPz'
        : this.authorityId
      return this.$store.state.authorities.find(authority => authority.id === authorityId)
    },
    authorityId () {
      return this.$route.params.authority
    }
  }
}
</script>
