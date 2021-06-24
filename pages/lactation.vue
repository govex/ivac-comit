<template>
  <div>
    <section>
      <b-row class="flex-column">
        <h1>
          Covid-19 vaccine policies on lactation
          <span class="text-muted" style="font-size: 1rem"><b-link :to="{path: '/pregnancy', query: $route.query}">(switch to pregnancy)</b-link></span>
        </h1>
        <PregnancyLactationFilter :selected-policy-positions="policyPositionFilters" :selected-vaccine="vaccinesFilters" />
      </b-row>
      <b-row class="flex-column">
        <client-only>
          <GlobalMap default-fill-color="#A0A0A0" :country-list-items="countryListItems" style-property="mostPermissiveLactationCode" />
        </client-only>
      </b-row>
    </section>
    <section>
      <PolicyPositionsIndicators font-size="0.8em" :country-list-items="countryListItems" status-word="lactating" :displayed-indicators="policyPositionFilters ? policyPositionFilters.concat('unclear') : undefined" indicator-property="mostPermissiveLactationCode" />
      <b-alert class="mt-4" variant="info" show>
        <h5 class="alert-heading">
          World Health Organization (WHO) policy position
        </h5>
        <div class="d-flex flex-row flex-nowrap justify-content-between align-items-baseline">
          <template v-if="!whoAuthorityVaccineRecommendations">
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
              <PregnancyLactationCodeIcons v-if="vaccine.mostRecentLactationCode" :codes="vaccine.mostRecentLactationCode" />
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
      <span>Showing {{ (countryListItems.length === 1 ? countryListItems.length + ' country / territory' : countryListItems.length + ' countries / territories') }}</span>
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
        <template #head(mostPermissiveLactationCode)>
          <template v-if="vaccinesFilters">
            Vaccination policy <b-icon-info-circle v-b-popover.hover="'The most recent policy found'" />
          </template>
          <template v-else>
            Vaccination policy <b-icon-info-circle v-b-popover.hover="'The most permissive policy found'" />
          </template>
        </template>
        <template #head(providerVisit)>
          Provider visit <b-icon-info-circle v-b-popover.hover="'What does the policy say about seeing a healthcare professional before vaccination?'" />
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
          <PregnancyLactationCodeIcons v-if="data.item.mostPermissiveLactationCode" :codes="data.item.mostPermissiveLactationCode" />
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
      return `/country/${
        data.item.name === 'Global'
        ? 'global'
        : data.item.code?.toLowerCase() || data.item.id
      }`
    }
  },
  data () {
    return {
      countryListFields: [
        { key: 'name', label: 'Country', class: 'align-middle', sortable: true },
        { key: 'mostPermissiveLactationCode', label: 'Vaccination Policy', class: 'text-center align-middle', sortable: true },
        { key: 'subgroups', class: 'text-center align-middle' },
        { key: 'providerVisit', label: 'Provider visit', class: 'text-center align-middle', sortable: true },
        { key: 'subgroups', label: 'Subgroups', class: 'text-center align-middle', sortable: true },
        { key: 'wbRegion', label: 'Region', class: 'text-truncate align-middle', sortable: true },
        { key: 'wbIncomeLevelName', label: 'Income Level', class: 'text-truncate align-middle', sortable: true }
      ]
    }
  },
  head () {
    return {
      title: 'COMIT: Lactation policies'
    }
  },
  computed: {
    countryListItems () {
      let countryListItems = this.$store.state.coreData.countries
        .reduce((result, country) => {
          if (country.wbRegion) {
            // get the most permissive/recent policy for across the vaccines specified, based upon lactation code
            const mostPermissiveLactationPolicy = this.$root.$getMostRecentOrPermissivePolicy(country, 'lactationCode', this.vaccinesFilters)
            const outputRow = {
              id: country.id,
              name: country.name,
              code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
              inTransition: country.inTransition,
              subgroups: mostPermissiveLactationPolicy?.lactationQualifications,
              mostPermissiveLactationCode: mostPermissiveLactationPolicy?.lactationCode,
              providerVisit: mostPermissiveLactationPolicy?.lactationCounselingAndInformation,
              wbRegion: country.wbRegion,
              wbIncomeLevelName: country.wbIncomeLevelName,
              wbIncomeLevelSort: country.wbIncomeLevelSort
            }
            result.push(outputRow)
          }
          return result
        }, [])

      // filter the results for policy positions
      if (this.policyPositionFilters?.length > 0) {
        countryListItems = countryListItems.filter((countryListItem) => {
          if (countryListItem.mostPermissiveLactationCode) {
            return countryListItem.mostPermissiveLactationCode.some(code => this.policyPositionFilters.includes(code.rank))
          } else {
            return false
          }
        })
      }

      // remove the entries which don't have a lactation code
      if (this.filtering) {
        countryListItems = countryListItems.filter((countryListItem) => {
          if (countryListItem.mostPermissiveLactationCode) {
            if (countryListItem.mostPermissiveLactationCode[0].rank === 999) {
              return false
            }
            return true
          }
          return false
        })
      }
      return countryListItems
    },
    filtering () {
      return (this.vaccinesFilters || this.policyPositionFilters?.length > 0)
    },
    policyPositionFilters () {
      return this.$route.query.policyPositions?.split(',').map(value => parseInt(value)) || undefined
    },
    vaccinesFilters () {
      return this.$route.query.vaccine
    },
    whoAuthority () {
      return this.$store.state.coreData.authorities.find(authority => authority.id === 'recFs2GvQUntKmKPz')
    },
    whoAuthorityVaccineRecommendations () {
      if (this.vaccinesFilters) {
        return this.$root.$getVaccineRecommendationsFromAuthority(this.whoAuthority, [this.vaccinesFilters])
      }
      return undefined
    }
  }
}
</script>

<style scoped>
.legend {max-width: 600px; margin: auto}
.legend-items {display: flex; flex: row wrap; border: 0.5px solid #E0E0E0}
.legend-color {height: 2rem; width: 2rem; margin: 0.2rem;}
</style>
