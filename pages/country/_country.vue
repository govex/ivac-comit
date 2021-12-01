<template>
  <div>
    <template v-if="country">
      <h1>{{ country.name }}</h1>
      <article>
        {{ _pageDescription }}
      </article>
      <div class="d-flex flex-column align-items-baseline justify-content-between">
        <h2 class="mt-5">Current Overview</h2>
        <!-- <div class="w-100 d-flex flex-row justify-content-center"> -->
          <div class="w-100 d-flex flex-row text-center justify-content-between align-items-stretch">
            <b-card v-if="country.wbPopulation2019" class="flex-fill m-2">
              <b-card-title aria-labelledby="population-label">{{ country.wbPopulation2019 | friendlyNumber }}</b-card-title>
              <b-card-body>
                <span id="population-label">Population</span>
                <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
              </b-card-body>
            </b-card>
            <b-card v-if="country.birthrate" class="flex-fill m-2">
              <b-card-title aria-labelledby="birthrate-label">{{ country.birthrate | friendlyNumber }}</b-card-title>
              <b-card-body id="birthrate-label">
                Birth rate
                <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
              </b-card-body>
            </b-card>
            <b-card v-if="country.wbIncomeLevelName" class="flex-fill m-2">
              <b-card-title aria-labelledby="income-level-label">{{ country.wbIncomeLevelName.replace(' income', '') }}</b-card-title>
              <b-card-body>
                <span id="income-level-label">Income level</span>
                <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
              </b-card-body>
            </b-card>
            <b-card v-if="country.wbRegion" class="flex-fill m-2">
              <b-card-title aria-labelledby="region-label">{{ country.wbRegion }}</b-card-title>
              <b-card-body>
                <span id="region-label">Region</span>
                <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
              </b-card-body>
            </b-card>
          </div>
        <!-- </div> -->

        <template v-if="!isGlobalCountry">
          <div class="w-100 rounded bg-light p-3 my-5">
            <h3>Public health authority policies</h3>
            <div class="w-100 d-flex justify-content-around align-items-stretch text-center">
              <div class="card w-50 m-2 p-4 justify-content-start">
                <span class="h2">Pregnancy</span>
                <template v-if="mostPermissivePregnancyCode">
                  <PolicyPositionsIndicators :displayed-indicators="mostPermissivePregnancyIndicators" />
                  <b-alert v-if="mostPermissivePregnancyCode && mostPermissivePregnancyCode.length > 1" variant="danger" class="my-3" show>
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
                <b-link to="/explore/public-health-authorities/pregnancy" class="mt-auto">
                  <b-button variant="link">
                    Compare to other countries
                  </b-button>
                </b-link>
              </div>
              <div class="card w-50 m-2 p-4 justify-content-start">
                <span class="h2">Lactation</span>
                <template v-if="mostPermissiveLactationCode">
                  <PolicyPositionsIndicators :displayed-indicators="mostPermissiveLactationIndicators" />
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
                <b-link to="/explore/public-health-authorities/lactation" class="mt-auto">
                  <b-button variant="link">
                    Compare to other countries
                  </b-button>
                </b-link>
              </div>
            </div>
            <template v-if="professionalSocietyRecommendations.length > 0">
              <h3 class="mt-5">Professional society positions</h3>
              <b-table
                head-variant="dark"
                hover
                :fields="professionalSocietyRecommendationFields"
                :items="professionalSocietyRecommendations"
                small
              >
                <template #cell(name)="data">
                  <b-link :to="`/organization/${data.item.id}`">
                    <span style="font-size: 1.25rem">{{ data.value }}</span>
                  </b-link>
                </template>

                <template #cell(pregnancyRecommendationCode)="data">
                  <pregnancy-lactation-code-icons :codes="data.value" />
                </template>

                <template #cell(lactationRecommendationCode)="data">
                  <pregnancy-lactation-code-icons :codes="data.value" />
                </template>

              </b-table>
            </template>
          </div>
        <h2>Public health authority policies by vaccine</h2>
        <VaccinePositions :country="country">
            No information available.
        </VaccinePositions>
        </template>
      </div>
      <div v-for="authorityByType of authoritiesByType" :key="authorityByType.authorityType" class="my-5">
        <h2>{{ authorityByType.displayName }}</h2>
        <template v-if="authorityByType.authorities.length > 0">
          <template v-for="authority of authorityByType.authorities">
            <div :key="authority.id" class="w-100 bg-light rounded p-3 mt-3">
              <div class="d-flex justify-content-between align-items-baseline">
                <div class="d-flex flex-row justify-content-between align-items-start">
                  <h3>
                    <b-link :to="`/organization/${authority.id}`">
                      {{ authority.name }}
                    </b-link>
                  </h3>
                  <!-- <b-badge variant="success" class="mx-2">
                    {{ authority.authorityType }}
                  </b-badge> -->
                  <span class="mx-2">
                    <b-link v-if="authority.website1" v-b-popover.hover="'View website in a new browser tab'" :href="authority.website1" target="_blank"><b-icon-globe /></b-link>
                    <b-link v-if="authority.website2" v-b-popover.hover="'View website in a new browser tab'" :href="authority.website2" target="_blank"><b-icon-globe /></b-link>
                    <b-link v-if="authority.website3" v-b-popover.hover="'View website in a new browser tab'" :href="authority.website3" target="_blank"><b-icon-globe /></b-link>
                  </span>
                </div>
                <span v-if="authority.reviewEvents">Most recently reviewed by us on {{ authority.reviewEvents.slice(-1)[0] }}</span>
              </div>
              <h4 class="mt-4">{{ authorityByType.vaccinePositionsLabel }}</h4>
              <VaccinePositions :authority="authority">
                No information available.
              </VaccinePositions>
              <h4 class="mt-4">Resources &amp; Guidance</h4>
              <AuthorityPolicies :policies="authority.policies | sortedByDate">
                No documents available.
              </AuthorityPolicies>
            </div>
          </template>
        </template>
        <template v-else>
          <span class="text-muted">We were unable to identify any {{ authorityByType.displayName }} associated with this country.</span>
        </template>
      </div>
      <div class="mt-4 h4">
        Legend
      </div>
      <PolicyPositionsIndicators :displayed-indicators="[1,2,3,4,5,999]" />
    </template>
    <div v-else>
      We couldn't find that country.
    </div>
  </div>
</template>

<script>
import pregnancyLactationCodeIcons from '~/components/pregnancyLactationCodeIcons.vue'
export default {
  components: { pregnancyLactationCodeIcons },
  data () {
    return {
      professionalSocietyRecommendationFields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'pregnancyRecommendationCode', label: 'Pregnancy', class: 'text-center'},
        { key: 'lactationRecommendationCode', label: 'Lactation', class: 'text-center'},
      ],
      authorityTypes: [
        { displayName: 'Public Health Authorities', authorityType: 'Public Health Authority', authorities: [], vaccinePositionsLabel: 'Current policies by vaccine' },
        // { displayName: 'Regulatory Bodies', authorityType: 'Regulatory Body', authorities: [] },
        { displayName: 'Professional Societies', authorityType: 'Professional Society', authorities: [], vaccinePositionsLabel: 'Current positions by vaccine' },
      ]
    }
  },
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
      if (this.country) {
        return `${this.country.name.endsWith('s') ? this.country.name + "'" : this.country.name + "'s"} Covid-19 maternity policy positions, vaccines, and resources`
      } else {
        return 'not found'
      }
    },
    _pageDescription () {
      if (this.isGlobalCountry) {
        return 'This page shows the resources and guidance of international health organizations.'
      } else if (this.country) {
        return [
          'As of ',
          new Date(this.mostRecentPhaReviewDate).toLocaleDateString(),
          ' ',
          this.country.name.endsWith('s') ? this.country.name + "'" : this.country.name + "'s",
          ' position on Covid-19 vaccination while pregnant is ',
          this.mostPermissivePregnancyCode 
            ? this.mostPermissivePregnancyCode.length > 1 
              ? 'unclear' 
              : this.mostPermissivePregnancyCode[0].value.toLowerCase()
            : 'unknown',
          ', and its position on vaccination while lactating is ',
          this.mostPermissiveLactationCode
            ? this.mostPermissiveLactationCode.length > 1 
              ? 'unclear' 
              : this.mostPermissiveLactationCode[0].value.toLowerCase()
            : 'unknown',
          '.'
        ].join('')
      } else {
        return 'not found'
      }
    },
    _pageImage () {
      return 'https://www.comitglobal.org/img/comit-dark-background.png'
    },
    _pageUrl () {
      return `https://www.comitglobal.org${this.$route.path}`
    },
    authoritiesByType () {
      const authoritiesByType = this.authorityTypes
      if (this.country?.authorities) {
        for (const authorityByType of authoritiesByType) {
          authorityByType.authorities = this.country.authorities.filter(authority => authority.authorityType === authorityByType.authorityType)
        }
      }
      return authoritiesByType
    },
    country () {
      const countryCode = this.countryCode?.toUpperCase()
      if (countryCode === 'GLOBAL') {
        return this.$store.state.countries.find(country => country.id === 'recqmhXt2Ey2DiVOd')
      }
      let country = this.$store.state.countries.find(country => country.iso3166Alpha2Code === countryCode)
      if (country) {
        return country
      }
      country = this.$store.state.countries.find(country => country.id === this.countryCode)
      if (country) {
        return country
      }
      return undefined
    },
    countryCode () {
      return this.$route.params.country
    },
    isGlobalCountry () {
      if (this.country) {
        return this.country.name === 'Global'
      } else {
        return false
      }
    },
    mostPermissiveLactationCode () {
      if (this.country) {
        return this.$root.$getMostRecentOrPermissivePolicy({ country: this.country, code: 'lactationCode' })?.lactationCode
      } else {
        return undefined
      }
    },
    mostPermissiveLactationIndicators () {
      if (this.mostPermissiveLactationCode) {
        return this.mostPermissiveLactationCode.map(code => code.rank)
      } else {
        return []
      }
    },
    mostPermissivePregnancyCode () {
      if (this.country) {
        return this.$root.$getMostRecentOrPermissivePolicy({ country: this.country, code: 'pregnancyCode' })?.pregnancyCode
      } else {
        return undefined
      }
    },
    mostPermissivePregnancyIndicators () {
      if (this.mostPermissivePregnancyCode) {
        return this.mostPermissivePregnancyCode.map(code => code.rank)
      } else {
        return []
      }
    },
    mostRecentPhaReviewDate () {
      return this.authoritiesByType
        .filter(authorityType => authorityType.authorityType === 'Public Health Authority')
        .flatMap(authorityType => (authorityType.authorities || []))
        .map(authority => (authority.reviewEvents || []).slice(-1)[0])
        .reduce((mostRecent, reviewEvent) => {
          if (reviewEvent > mostRecent) {
            return reviewEvent
          }
          return mostRecent
        }, '0000-00-00')
    },
    professionalSocietyRecommendations () {
      if (this.country) {
        return this.country.authorities
          .filter(authority => authority.authorityType === 'Professional Society')
          .map(a => {
            const pregnancyRecommendation = this.$root.$getMostRecentOrPermissivePolicy({ country: this.country, code: 'pregnancyCode', authority: a })
            const lactationRecommendation = this.$root.$getMostRecentOrPermissivePolicy({ country: this.country, code: 'lactationCode', authority: a })
            return {
              id: a.id,
              name: a.name,
              pregnancyRecommendation,
              pregnancyRecommendationCode: pregnancyRecommendation?.pregnancyCode || [],
              lactationRecommendation,
              lactationRecommendationCode: lactationRecommendation?.lactationCode || []
            }
          })
      } else {
        return []
      }
    }
  },
  mounted () {
    this.$route.meta.title = `${this.country.name} details`
    this.$route.meta.description = `Explore our information about ${this.country.name}, including current overall policy positions, recommendations by vaccine, vaccines being distributed, and other guidance we have found.`
  }
}
</script>
