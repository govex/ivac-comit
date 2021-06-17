<template>
  <div>
    <section>
      <b-row class="flex-column">
        <h1>
          Covid-19 vaccine policies on pregnancy
          <span class="text-muted" style="font-size: 1rem"><b-link :to="{path: '/lactation', query: $route.query}">(switch to lactation)</b-link></span>
        </h1>
        <PregnancyLactationFilter :selected-policy-positions="policyPositionFilters" :selected-vaccines="vaccinesFilters" />
      </b-row>
      <b-row class="flex-column">
        <client-only>
          <GlobalMap default-fill-color="#A0A0A0" :country-list-items="countryListItems" style-property="mostPermissivePregnancyCode" />
        </client-only>
      </b-row>
    </section>
    <section>
      <PolicyPositionsIndicators font-size="0.8em" :country-list-items="countryListItems" status-word="pregnant" :displayed-indicators="policyPositionFilters.length === 0 ? undefined : policyPositionFilters.concat('unclear','total')" indicator-property="mostPermissivePregnancyCode" />
      <b-alert class="mt-4" variant="info" show>
        <h5 class="alert-heading">
          World Health Organization policy (WHO) position
        </h5>
        <div class="d-flex flex-row flex-nowrap justify-content-between align-items-baseline">
          <template v-if="vaccinesFilters.length === 0">
            <span>The World Health Organization (WHO) makes recommendations for specific vaccines.</span>
            <b-button to="/authority/who" variant="info">
              View WHO recommendations
            </b-button>
          </template>
          <template v-else-if="whoAuthorityVaccineRecommendations.length > 0">
            <div v-for="vaccine of whoAuthorityVaccineRecommendations" :key="vaccine.id">
              <b-link :to="`/vaccine/${vaccine.id}`">
                {{ vaccine.displayName }}
              </b-link>
              <PregnancyLactationCodeIcons :codes="vaccine.mostRecentPregnancyCode" />
            </div>
            <b-button to="/authority/who" variant="info">
              View WHO recommendations for all vaccines
            </b-button>
          </template>
          <template v-else>
            <span>We could not find a WHO recommendation for the specifed vaccine.</span>
            <b-button to="/authority/who" variant="info">
              View WHO recommendations for all vaccines
            </b-button>
          </template>
        </div>
      </b-alert>
      <span>Showing {{ (countryListItems.length === 1 ? countryListItems.length + ' country / territory' : countryListItems.length + ' countries / territories') }}.</span>
      <b-table
        hover
        :items="countryListItems"
        primary-key="id"
        :fields="countryListFields"
        responsive
        sort-by="name"
        small
        head-variant="dark"
        :sort-compare="$root.$listSortComparer"
      >
        <template #head(name)>
          Country / territory <b-icon-info-circle v-b-popover.hover="'The country or territory name'" />
        </template>
        <template #head(mostPermissivePregnancyCode)>
          Vaccination policy <b-icon-info-circle v-b-popover.hover="'The most permissive policy found.'" />
        </template>
        <template #head(providerVisit)>
          Provider visit <b-icon-info-circle v-b-popover.hover="'Should a pregnant person speak with a healthcare professional before vaccination?'" />
        </template>
        <template #head(pregnancyTest)>
          Pregnancy test <b-icon-info-circle v-b-popover.hover="'Is a pregnancy test required before vaccination?'" />
        </template>
        <template #head(subgroups)>
          Subgroups <b-icon-info-circle v-b-popover.hover="'Specific subgroups'" />
        </template>
        <template #head(wbRegion)>
          Region <b-icon-info-circle v-b-popover.hover="'The global region of the country, sourced from the World Bank'" />
        </template>
        <template #head(wbIncomeLevelName)>
          Income Level <b-icon-info-circle v-b-popover.hover="'The country income level, sourced from the World Bank'" />
        </template>
        <template #cell(name)="data">
          <b-link :to="data | countryUrl">
            {{ data.item.name }}
          </b-link>
        </template>
        <template #cell(mostPermissivePregnancyCode)="data">
          <PregnancyLactationCodeIcons style="font-size: 1.4em" :codes="data.item.mostPermissivePregnancyCode" />
        </template>
        <template #cell(providerVisit)="data">
          <ProviderVisitLabel :codes="[data.value]" />
        </template>
        <template #cell(pregnancyTest)="data">
          <PregnancyTestLabel :codes="[data.value]" />
        </template>
        <template #cell(subgroups)="data">
          <PregnancySubgroupsIcons :codes="data | ensureArray" />
        </template>
        <template #cell(wbIncomeLevelName)="data">
          {{ data.value ? data.value.replace(' income', '') : undefined }}
        </template>
      </b-table>
    </section>
  </div>
</template>

<script>
export default {
  filters: {
    ensureArray (data) {
      if (Array.isArray(data.value)) { return data.value }
    },
    countryUrl (data) {
      if (data.item.name === 'Global') {
        return '/country/global'
      } else if (data.item.code) {
        return '/country/' + data.item.code.toLowerCase()
      } else {
        return '/country/' + data.item.id
      }
    }
  },
  data () {
    return {
      vaccinesFilters: [],
      policyPositionFilters: [],
      countryListItems: [],
      countryListFields: [
        { key: 'name', label: 'Country', class: 'align-middle', sortable: true },
        { key: 'mostPermissivePregnancyCode', label: 'Vaccination Policy', class: 'text-center align-middle', sortable: true },
        { key: 'subgroups', class: 'text-center align-middle' },
        { key: 'providerVisit', class: 'text-center align-middle', sortable: true },
        { key: 'pregnancyTest', class: 'text-center align-middle', sortable: true },
        { key: 'wbRegion', label: 'Region', class: 'align-middle text-truncate', sortable: true },
        { key: 'wbIncomeLevelName', label: 'Income Level', class: 'align-middle text-truncate', sortable: true }
      ]
    }
  },
  head () {
    return {
      title: 'COMIT: Pregnancy policies'
    }
  },
  computed: {
    filtering () {
      return (this.vaccinesFilters.length > 0 || this.policyPositionFilters.length > 0)
    },
    whoAuthority () {
      return this.$store.state.coreData.authorities.find(authority => authority.id === 'recFs2GvQUntKmKPz')
    },
    whoAuthorityVaccineRecommendations () {
      return this.$root.$getVaccineRecommendationsFromAuthority(this.whoAuthority, this.vaccinesFilters)
    }
  },
  watch: {
    '$route.query' () {
      this.vaccinesFilters = this.$route.query.vaccines ? this.$route.query.vaccines.split(',') : []
      this.policyPositionFilters = (this.$route.query.policyPositions ? this.$route.query.policyPositions.split(',') : [])
        .map(policyPosition => Number.parseInt(policyPosition))
      this.countryListItems = this.getCountryListItems(this.vaccinesFilters, this.policyPositionFilters)
    }
  },
  created () {
    this.vaccinesFilters =
      this.$route.query.vaccines
        ? this.$route.query.vaccines.split(',')
        : []
    this.policyPositionFilters =
      this.$route.query.policyPositions
        ? this.$route.query.policyPositions.split(',').map(policyPosition => Number.parseInt(policyPosition))
        : []
    this.countryListItems = this.getCountryListItems(this.vaccinesFilters, this.policyPositionFilters)
  },
  methods: {
    getCountryListItems (vaccinesFilters, policyPositionsFilters) {
      let countryListItems = this.$store.state.coreData.countries
        .reduce((result, country) => {
          if (country.wbRegion) {
            const outputRow = {
              id: country.id,
              name: country.name,
              code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
              inTransition: country.inTransition,
              subgroups: country.authorities
                ? (country.authorities.slice(-1)[0].policies
                    ? country.authorities.slice(-1)[0].policies.slice(-1)[0].pregnancyQualifications
                    : undefined)
                : undefined,
              mostPermissivePregnancyCode: this.$root.$getMostPermissiveCode(country, 'pregnancyCode', vaccinesFilters),
              pregnancyTest: country.authorities
                ? (country.authorities.slice(-1)[0].policies
                    ? country.authorities.slice(-1)[0].policies.slice(-1)[0].pregnancyTest
                    : undefined)
                : undefined,
              providerVisit: country.authorities
                ? (country.authorities.slice(-1)[0].policies
                    ? country.authorities.slice(-1)[0].policies.slice(-1)[0].pregnancyCounselingAndInformation
                    : undefined)
                : undefined,
              wbRegion: country.wbRegion,
              wbIncomeLevelName: country.wbIncomeLevelName,
              wbIncomeLevelSort: country.wbIncomeLevelSort
            }
            result.push(outputRow)
          }
          return result
        }, [])
      if (policyPositionsFilters.length > 0) {
        countryListItems = countryListItems.filter((countryListItem) => {
          if (countryListItem.mostPermissivePregnancyCode) {
            return countryListItem.mostPermissivePregnancyCode.some(code => policyPositionsFilters.includes(code.rank))
          } else {
            return false
          }
        })
      }
      if (this.filtering) {
        countryListItems = countryListItems.filter((countryListItem) => {
          return (countryListItem.mostPermissivePregnancyCode)
        })
      }
      return countryListItems
    }
  }
}
</script>

<style scoped>
.legend {max-width: 600px; margin: auto}
.legend-items {display: flex; flex: row wrap; border: 0.5px solid #E0E0E0}
.legend-color {height: 2rem; width: 2rem; margin: 0.2rem;}
</style>
