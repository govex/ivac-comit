<template>
  <div>
    <div class="d-flex flex-row justify-content-between align-items-center">
      <h1>
        {{ authority.name }}
      </h1>
      <span v-if="authority.reviewEvents">Most recently reviewed by us on {{ authority.reviewEvents.slice(-1)[0] }}</span>
    </div>
    <div class="w-100 mb-5 align-items-baseline">
      <b-badge variant="success">
        {{ authority.authorityType }}
      </b-badge> |
      <span v-for="country of authority.countries" :key="country.id">
        <b-link v-if="country.name === 'Global'" to="/country/global">
          {{ country.name }}
        </b-link>
        <b-link v-else-if="country.iso3166Alpha2Code" :to="`/country/${country.iso3166Alpha2Code.toLowerCase()}`">
          {{ country.name }}
        </b-link>
        <span v-else>{{ country.name }}</span>
      </span>
    </div>

    <h2>Most recent vaccine policy positions</h2>
    <AuthorityVaccinePolicies :authority="authority">
      No information available.
    </AuthorityVaccinePolicies>

    <h2 class="mt-5">
      Resources &amp; guidance
    </h2>
    <AuthorityPolicies :policies="authority.policies">
      No information available.
    </AuthorityPolicies>

    <h2>Important links</h2>
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
  </div>
</template>

<script>
export default {
  asyncData ({ params }) {
    let authority, authorityId
    if (params.authority) {
      authorityId = params.authority
      if (authorityId === 'who') { authorityId = 'recFs2GvQUntKmKPz' }
    }
    return { authorityId, authority, authorityName: undefined }
  },
  head () {
    return {
      title: `COMIT: ${this.authorityName}`
    }
  },
  created () {
    this.authority = this.$store.state.coreData.authorities.find(authority => authority.id === this.authorityId)
    if (this.authority) {
      this.authorityName = this.authority.name
    }
  }
}
</script>
