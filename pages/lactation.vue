<template>
  <div>
    <section>
      <b-row class="flex-column">
        <h1>
          Covid-19 vaccine policies on lactation
          <span class="text-muted" style="font-size: 1rem"><b-link to="/pregnancy">(switch to pregnancy)</b-link></span>
        </h1>
        <PregnancyLactationFilter :selected-policy-positions="policyPositionFilters" :selected-vaccines="vaccinesFilters" />
      </b-row>
      <b-row class="flex-column">
        <client-only>
          <GlobalMap default-fill-color="#A0A0A0" :country-list-items="countryListItems" style-property="mostPermissiveLactationCode" />
        </client-only>
      </b-row>
    </section>
    <section>
      <div class="d-flex flex-column">
        <div class="text-center">
          <h4>Legend</h4>
        </div>
        <div class="d-flex">
          <div class="mx-auto legend-items p-3">
            <div class="d-flex flex-column">
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="recommended legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Recommended for some or all
                  <b-icon-info-circle v-b-popover.hover="'An explicit recommendation that some or all lactating people should receive vaccination.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="permitted-for-all legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Permitted
                  <b-icon-info-circle v-b-popover.hover="'All lactating people can receive, may receive, or can choose to receive vaccination.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="permitted-with-qualifications legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Permitted with qualifications
                  <b-icon-info-circle v-b-popover.hover="'Only certain groups of lactating people, e.g., those at high risk of exposure, or with underlying conditions, can, may, or can choose to receive vaccination.'" />
                </span>
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="not-recommended-with-exceptions legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Not recommended, but with exceptions
                  <b-icon-info-circle v-b-popover.hover="'A statement stating lactating people should not receive vaccination, with certain exceptions provided.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middlem mx-2">
                <svg class="prohibited legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Not recommended
                  <b-icon-info-circle v-b-popover.hover="'Lactating people should not receive the vaccine or vaccine is contraindicated.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="no-language legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  No policy position found
                  <b-icon-info-circle v-b-popover.hover="'In instances where no policies or positions regarding lactation and vaccination could be found, or where no position was clearly established, e.g., &quot;if breastfeeding, talk to your doctor.&quot;'" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <b-alert class="mt-4 d-flex flex-row flex-nowrap justify-content-between align-items-baseline" variant="info" show>
        <span>The World Health Organization (WHO) makes recommendations for specific vaccines.</span>
        <b-button to="/authority/who" variant="info">
          View WHO recommendations
        </b-button>
      </b-alert>
      <span>Showing {{ (countryListItems.length === 1 ? countryListItems.length + ' country' : countryListItems.length + ' countries') }}.</span>
      <b-table
        hover
        :items="countryListItems"
        primary-key="id"
        :fields="countryListFields"
        sort-by="name"
        small
        head-variant="dark"
        :sort-compare="$root.$listSortComparer"
      >
        <template #head(name)>
          Country <b-icon-info-circle v-b-popover.hover="'The country name'" />
        </template>
        <template #head(mostPermissiveLactationCode)>
          Vaccination policy <b-icon-info-circle v-b-popover.hover="'The most permissive policy found.'" />
        </template>
        <template #head(providerVisit)>
          Provider visit <b-icon-info-circle v-b-popover.hover="'Should a lactating person speak with a healthcare professional before vaccination?'" />
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
        <template #cell(mostPermissiveLactationCode)="data">
          <PregnancyLactationCodeIcons :codes="data.item.mostPermissiveLactationCode" />
        </template>
        <template #cell(providerVisit)="data">
          <ProviderVisitLabel :codes="[data.value]" />
        </template>
        <template #cell(subgroups)="data">
          <LactationSubgroupsIcons :codes="data | ensureArray" />
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
    lowerCase (value) {
      if (typeof value === 'string') {
        return value.toLowerCase()
      } else {
        return value
      }
    },
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
        { key: 'name', label: 'Country', sortable: true },
        { key: 'mostPermissiveLactationCode', label: 'Vaccination Policy', class: 'text-center', sortable: true },
        { key: 'subgroups', class: 'text-center' },
        { key: 'providerVisit', label: 'Provider visit', class: 'text-center', sortable: true },
        { key: 'subgroups', label: 'Subgroups', class: 'text-center', sortable: true },
        { key: 'wbRegion', label: 'Region', sortable: true },
        { key: 'wbIncomeLevelName', label: 'Income Level', sortable: true }
      ]
    }
  },
  head () {
    return {
      title: 'COMIT: Lactation policies'
    }
  },
  computed: {
    filtering () {
      return (this.vaccinesFilters.length > 0 || this.policyPositionFilters.length > 0)
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
              mostPermissiveLactationCode: this.$root.$getMostPermissiveCode(country, 'lactationCode', vaccinesFilters),
              providerVisit: country.authorities
                ? (country.authorities.slice(-1)[0].policies
                    ? country.authorities.slice(-1)[0].policies.slice(-1)[0].lactationCounselingAndInformation
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
          if (countryListItem.mostPermissiveLactationCode) {
            return countryListItem.mostPermissiveLactationCode.some(code => policyPositionsFilters.includes(code.rank))
          } else {
            return false
          }
        })
      }
      if (this.filtering) {
        countryListItems = countryListItems.filter((countryListItem) => {
          return (countryListItem.mostPermissiveLactationCode)
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
