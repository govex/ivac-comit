<template>
  <div>
    <section>
      <b-row class="flex-column">
        <h1>
          Covid-19 vaccine policies on pregnancy
          <span class="text-muted" style="font-size: 1rem"><b-link :to="{path: '/lactation', query: $route.query}">(switch to lactation)</b-link></span>
        </h1>
        <PregnancyLactationFilter :selected-policy-positions="policyPositionFilters" :selected-vaccine="vaccinesFilters" />
      </b-row>
      <b-row class="flex-column justify-content-center align-items-center">
        <input v-model="timeWarpIndex" type="range" min="0" :max="timeWarpDates.length - 1" class="w-75 custom-range">
        <span>{{ (timeWarpIndex <= timeWarpDates.length - 2) ? timeWarpDate : 'Present' }}</span>
      </b-row>
      <b-row class="flex-column">
        <client-only>
          <GlobalMap default-fill-color="#A0A0A0" :country-list-items="countryListItems" style-property="mostPermissivePregnancyCode" />
        </client-only>
      </b-row>
    </section>
    <section>
      <PolicyPositionsIndicators font-size="0.8em" :country-list-items="countryListItems" status-word="pregnant" :displayed-indicators="policyPositionFilters ? policyPositionFilters.concat('unclear') : undefined" indicator-property="mostPermissivePregnancyCode" />
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
              <PregnancyLactationCodeIcons v-if="vaccine.mostRecentPregnancyCode" :codes="vaccine.mostRecentPregnancyCode" />
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
        <template #head(mostPermissivePregnancyCode)>
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
        <template #head(pregnancyTest)>
          Pregnancy test <b-icon-info-circle v-b-popover.hover="'What does the policy say about getting a pregnancy test before vaccination?'" />
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
          <PregnancyLactationCodeIcons v-if="data.item.mostPermissivePregnancyCode" style="font-size: 1.4em" :codes="data.item.mostPermissivePregnancyCode" />
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
        { key: 'mostPermissivePregnancyCode', label: 'Vaccination Policy', class: 'text-center align-middle', sortable: true },
        { key: 'subgroups', class: 'text-center align-middle' },
        { key: 'providerVisit', class: 'text-center align-middle', sortable: true },
        { key: 'pregnancyTest', class: 'text-center align-middle', sortable: true },
        { key: 'wbRegion', label: 'Region', class: 'align-middle text-truncate', sortable: true },
        { key: 'wbIncomeLevelName', label: 'Income Level', class: 'align-middle text-truncate', sortable: true }
      ],
      timeWarpIndex: Number.MAX_VALUE
    }
  },
  head () {
    return {
      title: 'COMIT: Pregnancy policies'
    }
  },
  computed: {
    countryListItems () {
      let countryListItems = this.$store.state.coreData.countries
        .reduce((result, country) => {
          if (country.wbRegion) {
            const mostRecentOrPermissivePolicy = this.$root.$getMostRecentOrPermissivePolicy(country, 'pregnancyCode', this.vaccinesFilters, undefined, this.timeWarpDate)
            const outputRow = {
              id: country.id,
              name: country.name,
              code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
              inTransition: country.inTransition,
              subgroups: mostRecentOrPermissivePolicy?.pregnancyQualifications,
              mostPermissivePregnancyCode: mostRecentOrPermissivePolicy?.pregnancyCode,
              pregnancyTest: mostRecentOrPermissivePolicy?.pregnancyTest,
              providerVisit: mostRecentOrPermissivePolicy?.pregnancyCounselingAndInformation,
              wbRegion: country.wbRegion,
              wbIncomeLevelName: country.wbIncomeLevelName,
              wbIncomeLevelSort: country.wbIncomeLevelSort,
              policyDate: mostRecentOrPermissivePolicy?.['datePublished/lastUpdated'] || mostRecentOrPermissivePolicy?.dateAccessed
            }
            result.push(outputRow)
          }
          return result
        }, [])
      if (this.policyPositionFilters?.length > 0) {
        countryListItems = countryListItems.filter((countryListItem) => {
          if (countryListItem.mostPermissivePregnancyCode) {
            return countryListItem.mostPermissivePregnancyCode.some(code => this.policyPositionFilters.includes(code.rank))
          } else {
            return false
          }
        })
      }
      if (this.filtering) {
        countryListItems = countryListItems.filter((countryListItem) => {
          if (countryListItem.mostPermissivePregnancyCode) {
            if (countryListItem.mostPermissivePregnancyCode[0].rank === 999) {
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
    timeWarpDate () {
      if (this.timeWarpIndex === Infinity) { return undefined }
      else { return this.timeWarpDates[this.timeWarpIndex] }
    },
    timeWarpDates () {
      const twInfo = this.$store.state.coreData.policies.reduce((range, policy) => {
        const policyDate = policy['datePublished/lastUpdated'] || policy.dateAccessed
        range.max = policyDate > range.max ? policyDate : range.max
        range.min = policyDate < range.min ? policyDate : range.min
        return range
      }, { min: '9999-99-99', max: '0000-00-00' })
      if (twInfo.min > twInfo.max) { return [] }
      const timeWarpDates = []
      twInfo.min = new Date(twInfo.min)
      twInfo.max = new Date(twInfo.max)
      do {
        timeWarpDates.push(twInfo.min.toISOString().slice(0, 10))
        twInfo.min.setDate(twInfo.min.getDate() + 14)
      } while (twInfo.min < twInfo.max)
      timeWarpDates.push(twInfo.max.toISOString().slice(0,10))
      return timeWarpDates
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
