<template>
  <div>
    <div class="d-flex flex-row justify-content-between align-items-baseline">
      <h1>
        {{ authority.name }}
        <b-link v-if="authority.website1" :href="authority.website1" target="_blank" class="mx-1">
          <b-icon-box-arrow-up-right />
        </b-link>
        <b-link v-if="authority.website2" :href="authority.website2" target="_blank" class="mx-1">
          <b-icon-box-arrow-up-right />
        </b-link>
        <b-link v-if="authority.website3" :href="authority.website3" target="_blank" class="mx-1">
          <b-icon-box-arrow-up-right />
        </b-link>
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
    <h2>Resources &amp; Guidance</h2>
    <AuthorityPolicies :policies="authority.policies">
      No information available.
    </AuthorityPolicies>
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
