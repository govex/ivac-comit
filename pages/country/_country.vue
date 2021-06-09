<template>
  <div>
    <!-- <div>
      <b-row>
        <b-breadcrumb :items="breadcrumbItems" />
      </b-row>
    </div> -->
    <div v-if="country" class="w-100">
      <div class="w-100 d-flex flex-column align-items-baseline justify-content-between">
        <h1>{{ country.name }} <span v-if="country.iso3166Alpha2Code">({{ country.iso3166Alpha2Code }})</span></h1>
        <div class="w-100 d-flex row my-5 text-center justify-content-center">
          <b-col v-if="country.wbPopulation2019" cols="3">
            <b-card>
              <b-card-title> {{ country.wbPopulation2019 | friendlyNumber }}</b-card-title>
              <b-card-body>
                Population
                <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
              </b-card-body>
            </b-card>
          </b-col>
          <b-col v-if="country.wbIncomeLevelName" cols="3">
            <b-card>
              <b-card-title>{{ country.wbIncomeLevelName.replace(' income', '') }}</b-card-title>
              <b-card-body>
                Income Level
                <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
              </b-card-body>
            </b-card>
          </b-col>
          <b-col v-if="country.wbRegion" cols="3">
            <b-card>
              <b-card-title>{{ country.wbRegion }}</b-card-title>
              <b-card-body>
                Region
                <b-icon-info-circle v-b-popover.hover="'most recent data from the World Bank'" />
              </b-card-body>
            </b-card>
          </b-col>
        </div>
        <div class="w-100 d-flex justify-content-around align-items-start text-center">
          <b-card bg-variant="dark" text-variant="white" class="m-1">
            <b-card-title class="d-flex flex-column">
              <template v-if="mostPermissivePregnancyCode">
                <PregnancyLactationCodeIcons :codes="mostPermissivePregnancyCode" />
                <span class="mt-3">{{ mostPermissivePregnancyCode | showValues }}</span>
              </template>
              <template v-else>
                <span><b-icon-question-circle /> No policy position found</span>
              </template>
            </b-card-title>
            <b-card-body class="d-flex flex-column">
              <span v-if="mostPermissivePregnancyCode && mostPermissivePregnancyCode.length > 1" class="text-warning">Within the guidance document, there are pieces language that could be interpreted as indicating different policy positions</span>
              <span>Overall recommendation for vaccination while pregnant</span>
            </b-card-body>
            <b-card-footer>
              <b-link to="/pregnancy">
                <b-button variant="primary">
                  Compare to other countries
                </b-button>
              </b-link>
            </b-card-footer>
          </b-card>
          <b-card bg-variant="dark" text-variant="white" class="m-1">
            <b-card-title class="d-flex flex-column text-center">
              <template v-if="mostPermissiveLactationCode">
                <PregnancyLactationCodeIcons :codes="mostPermissiveLactationCode" />
                <span class="mt-3">{{ mostPermissiveLactationCode | showValues }}</span>
              </template>
              <template v-else>
                <span><b-icon-question-circle /> No policy position found</span>
              </template>
            </b-card-title>
            <b-card-body>
              <span v-if="mostPermissiveLactationCode && mostPermissiveLactationCode.length > 1" class="text-danger">Within the guidance document, there are pieces language that could be interpreted as indicating different policy positions</span>
              <span>Overall recommendation for vaccination while lactating</span>
            </b-card-body>
            <b-card-footer>
              <b-link to="/lactation">
                <b-button variant="primary">
                  Compare to other countries
                </b-button>
              </b-link>
            </b-card-footer>
          </b-card>
        </div>
      </div>
      <div class="my-5">
        <template v-if="country.vaccines">
          <h2>Vaccines Administered <b-icon-info-circle v-b-popover.hover="'Information about vaccines administered in each country obtained from Our World In Data.'" font-scale="0.5" /></h2>
          <b-table-simple>
            <b-thead>
              <b-tr>
                <b-th>Manufacturer</b-th>
                <b-th>Product</b-th>
                <b-th>Other Names</b-th>
                <b-th>Platform</b-th>
                <b-th class="text-center">
                  Other countries using this vaccine
                </b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="vaccine of country.vaccines" :key="vaccine.id" :to="`/vaccine/${vaccine.id}`">
                <b-td>
                  <b-link :to="`/vaccine/${vaccine.id}`">
                    {{ vaccine.manufacturer }}
                  </b-link>
                </b-td>
                <b-td>
                  <b-link :to="`/vaccine/${vaccine.id}`">
                    {{ vaccine.name }}
                  </b-link>
                </b-td>
                <b-td>{{ vaccine.otherNames }}</b-td>
                <b-td>{{ vaccine.platform }}</b-td>
                <b-td class="text-center">
                  {{ vaccine.countries.length - 1 }}
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </template>
        <!-- <template v-else>
          <p>No information available.</p>
        </template> -->
      </div>
      <h2 class="mb-5">
        Resources &amp; Guidance
      </h2>
      <div v-for="authorityByType of authoritiesByType" :key="authorityByType.authorityType" class="mb-5">
        <!-- <h3><b-icon-arrow-down-right-square-fill /> {{ authorityByType.displayName }}</h3> -->
        <template v-if="authorityByType.authorities.length > 0">
          <template v-for="authority of authorityByType.authorities">
            <div :key="authority.id" class="w-100">
              <div class="d-flex justify-content-between align-items-baseline mt-3">
                <h4>
                  <b-link :to="`/authority/${authority.id}`">
                    {{ authority.name }}
                  </b-link>
                  <sup>
                    <a v-if="authority.website1" :href="authority.website1" target="_blank">1</a>
                    <a v-if="authority.website2" :href="authority.website2" target="_blank">2</a>
                    <a v-if="authority.website3" :href="authority.website3" target="_blank">3</a>
                  </sup>
                </h4>
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
    let countryCode, country, mostPermissivePregnancyCode, mostPermissiveLactationCode
    if (params.country) {
      countryCode = params.country.toUpperCase()
    }
    const authoritiesByType = [
      { displayName: 'Public Health Authorities', authorityType: 'Public Health Authority', authorities: [] }
      // { displayName: 'Regulatory Bodies', authorityType: 'Regulatory Body', authorities: [] },
      // { displayName: 'Professional Societies', authorityType: 'Professional Society', authorities: [] }
    ]
    // const breadcrumbItems = [
    //   { text: 'Home', to: '/' },
    //   { text: 'Countries', to: '#' }
    // ]

    return { country, countryCode, authoritiesByType, mostPermissivePregnancyCode, mostPermissiveLactationCode }
  },
  created () {
    if (this.countryCode === 'GLOBAL') {
      this.country = this.$store.state.coreData.countries.find(country => country.id === 'recqmhXt2Ey2DiVOd')
      // this.breadcrumbItems.push({ text: 'Global', to: '/country/global' })
    } else {
      this.country = this.$store.state.coreData.countries.find(country => country.iso3166Alpha2Code === this.countryCode)
    }
    if (this.country) {
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
