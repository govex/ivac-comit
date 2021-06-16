<template>
  <div>
    <div v-if="country" class="w-100">
      <div class="w-100 d-flex flex-column align-items-baseline justify-content-between">
        <h1>Country Details: {{ country.name }}</h1>
        <div class="w-100 d-flex row my-5 text-center justify-content-center align-items-stretch">
          <b-card v-if="country.wbPopulation2019" class="col-lg-3 m-2">
            <b-card-title> {{ country.wbPopulation2019 | friendlyNumber }}</b-card-title>
            <b-card-body>
              Population
              <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
            </b-card-body>
          </b-card>
          <b-card v-if="country.birthrate" class="col-lg-3 m-2">
            <b-card-title> {{ country.birthrate | friendlyNumber }}</b-card-title>
            <b-card-body>
              Birth rate
              <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
            </b-card-body>
          </b-card>
          <b-card v-if="country.wbIncomeLevelName" class="col-lg-3 m-2">
            <b-card-title>{{ country.wbIncomeLevelName.replace(' income', '') }}</b-card-title>
            <b-card-body>
              Income Level
              <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
            </b-card-body>
          </b-card>
          <b-card v-if="country.wbRegion" class="col-lg-3 m-2">
            <b-card-title>{{ country.wbRegion }}</b-card-title>
            <b-card-body>
              Region
              <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
            </b-card-body>
          </b-card>
        </div>
        <div class="w-100 d-flex justify-content-around align-items-stretch text-center">
          <div class="card w-50 m-2 p-4 justify-content-start">
            <h2>Pregnancy</h2>
            <template v-if="mostPermissivePregnancyCode">
              <h1>
                <PregnancyLactationCodeIcons :codes="mostPermissivePregnancyCode" />
              </h1>
              <span class="m-3">{{ mostPermissivePregnancyCode | showValues }}</span>
              <b-alert v-if="mostPermissivePregnancyCode && mostPermissivePregnancyCode.length > 1" variant="danger" show>
                Within the documents we reviewed, there is language that could be interpreted as indicating different policy positions
              </b-alert>
              <span class="my-2">Most permissive recommendation across all vaccines in country.</span>
            </template>
            <template v-else>
              <h1>
                <b-icon-question-circle />
              </h1>
              <span>No policy position found</span>
            </template>
            <b-link to="/pregnancy" class="mt-auto">
              <b-button variant="link">
                Compare to other countries
              </b-button>
            </b-link>
          </div>
          <div class="card w-50 m-2 p-4 justify-content-start">
            <h2>Lactation</h2>
            <template v-if="mostPermissiveLactationCode">
              <h1>
                <PregnancyLactationCodeIcons :codes="mostPermissiveLactationCode" />
              </h1>
              <span class="m-3">{{ mostPermissiveLactationCode | showValues }}</span>
              <b-alert v-if="mostPermissiveLactationCode && mostPermissiveLactationCode.length > 1" variant="danger" show>
                Within the documents we reviewed, there is language that could be interpreted as indicating different policy positions
              </b-alert>
              <span class="my-2">Most permissive recommendation across all vaccines in country.</span>
            </template>
            <template v-else>
              <h1>
                <b-icon-question-circle />
              </h1>
              <span>No policy position found</span>
            </template>
            <b-link to="/lactation" class="mt-auto">
              <b-button variant="link">
                Compare to other countries
              </b-button>
            </b-link>
          </div>
        </div>
      </div>
      <h4 class="mt-4">
        Legend
      </h4>
      <PolicyPositionsIndicators :displayed-indicators="[1,2,3,4,5,999,'unclear']" />
      <div class="my-5">
        <template v-if="country.vaccines">
          <h2>Vaccines</h2>
          <CountryVaccines :country="country" />
        </template>
      </div>
      <h2 class="mb-5">
        Resources &amp; guidance
      </h2>
      <div v-for="authorityByType of authoritiesByType" :key="authorityByType.authorityType" class="mb-5">
        <!-- <h3><b-icon-arrow-down-right-square-fill /> {{ authorityByType.displayName }}</h3> -->
        <template v-if="authorityByType.authorities.length > 0">
          <template v-for="authority of authorityByType.authorities">
            <div :key="authority.id" class="w-100">
              <div class="d-flex justify-content-between align-items-baseline mt-3">
                <div class="d-flex flex-row justify-content-between align-items-center">
                  <h4>
                    <b-link :to="`/authority/${authority.id}`">
                      {{ authority.name }}
                    </b-link>
                  </h4>
                  <b-badge variant="success" class="mx-2">
                    {{ authority.authorityType }}
                  </b-badge>
                  <span class="mx-2">
                    <a v-if="authority.website1" v-b-popover.hover="'View website in a new browser tab'" :href="authority.website1"  target="_blank" ><b-icon-globe /></a>
                    <a v-if="authority.website2" v-b-popover.hover="'View website in a new browser tab'" :href="authority.website2" target="_blank"><b-icon-globe /></a>
                    <a v-if="authority.website3" v-b-popover.hover="'View website in a new browser tab'" :href="authority.website3" target="_blank"><b-icon-globe /></a>
                  </span>
                </div>
                <!-- <h4>
                  <b-link :to="`/authority/${authority.id}`">
                    {{ authority.name }}
                  </b-link>
                  <b-badge variant="primary">{{ authority.authorityType }}</b-badge>
                  <sup>
                    <a v-if="authority.website1" :href="authority.website1" target="_blank"><b-icon-globe /></a>
                    <a v-if="authority.website2" :href="authority.website2" target="_blank"><b-icon-globe /></a>
                    <a v-if="authority.website3" :href="authority.website3" target="_blank"><b-icon-globe /></a>
                  </sup>
                </h4> -->
                <span v-if="authority.reviewEvents">Most recently reviewed by us on {{ authority.reviewEvents.slice(-1)[0] }}</span>
              </div>
              <AuthorityPolicies :policies="authority.policies | sortedByDate">
                No documents available.
              </AuthorityPolicies>
            </div>
          </template>
        </template>
        <template v-else>
          <span>No documents available.</span>
        </template>
      </div>
    </div>
    <div v-else>
      We couldn't find that country.
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    friendlyNumber: (value) => {
      if (typeof (value) === 'number') {
        return value.toLocaleString()
      } else {
        return value
      }
    },
    deArray (value) {
      if (Array.isArray(value)) {
        return value.join(', ')
      } else {
        return value
      }
    },
    sortedByDate (value) {
      if (Array.isArray(value)) {
        return [...value].sort((policy1, policy2) => {
          if (policy1['datePublished/lastUpdated'] && policy2['datePublished/lastUpdated']) {
            return policy2['datePublished/lastUpdated'].localeCompare(policy1['datePublished/lastUpdated'])
          }
          return 0
        })
      }
    },
    showValues (value) {
      if (Array.isArray(value)) {
        return value
          .map(code => code.value)
          .join('; ')
      }
    }
  },
  asyncData ({ params }) {
    let countryCode, countryName, country, mostPermissivePregnancyCode, mostPermissiveLactationCode
    if (params.country) {
      countryCode = params.country.toUpperCase()
    }
    const authoritiesByType = [
      { displayName: 'Public Health Authorities', authorityType: 'Public Health Authority', authorities: [] }
      // { displayName: 'Regulatory Bodies', authorityType: 'Regulatory Body', authorities: [] },
      // { displayName: 'Professional Societies', authorityType: 'Professional Society', authorities: [] }
    ]
    return { country, countryCode, countryName, authoritiesByType, mostPermissivePregnancyCode, mostPermissiveLactationCode }
  },
  head () {
    return {
      title: `COMIT: ${this.countryName}`
    }
  },
  created () {
    if (this.countryCode === 'GLOBAL') {
      this.country = this.$store.state.coreData.countries.find(country => country.id === 'recqmhXt2Ey2DiVOd')
      // this.breadcrumbItems.push({ text: 'Global', to: '/country/global' })
    } else {
      this.country = this.$store.state.coreData.countries.find(country => country.iso3166Alpha2Code === this.countryCode)
    }
    if (this.country) {
      this.countryName = this.country.name
      if (this.country.authorities) {
        for (const authorityByType of this.authoritiesByType) {
          authorityByType.authorities = this.country.authorities.filter(authority => authority.authorityType === authorityByType.authorityType)
        }
        this.mostPermissivePregnancyCode = this.$root.$getMostPermissiveCode(this.country, 'pregnancyCode')
        this.mostPermissiveLactationCode = this.$root.$getMostPermissiveCode(this.country, 'lactationCode')
      }
      // this.breadcrumbItems[2] = { text: this.country.name, to: `/country/${this.country.iso3166Alpha2Code.toLowerCase()}` }
    } else {
      // this.breadcrumbItems[2] = { text: '[unknown country]', to: '#' }
    }
  }
}
</script>
