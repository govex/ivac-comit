<template>
  <div>
    <div>
      <b-row>
        <b-breadcrumb :items="breadcrumbItems" />
      </b-row>
    </div>
    <section>
      <b-row class="flex-column">
        <h2>Filters</h2>
        <PregnancyFilter />
      </b-row>
    </section>
    <section>
      <b-row>
        <h2>Global Map</h2>
        <GlobalMap :country-styles="getMapStylesForPregnancyCode" default-fill-color="#A0A0A0" />
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
              <div class="d-flex flex-row align-items-middle">
                <svg class="recommended legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>Recommended</span>
              </div>
              <div class="d-flex flex-row align-items-middle">
                <svg class="permitted-for-all legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>Permitted for all</span>
              </div>
              <div class="d-flex flex-row align-items-middle">
                <svg class="permitted-with-qualifications legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>Permitted with qualifications</span>
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex flex-row align-items-middle">
                <svg class="not-recommended-with-exceptions legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>Not recommended, but with exceptions</span>
              </div>
              <div class="d-flex flex-row align-items-middle">
                <svg class="prohibited legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>Prohibited</span>
              </div>
              <div class="d-flex flex-row align-items-middle">
                <svg class="no-language legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>No language</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <h2>Countries</h2>
      <span>This list displays the most permissive policy / guidance from each country across amongst all vaccines. Note that the World Health Organization makes recommendations for specific vaccines; you can view them <b-link to="/country/global">here</b-link></span>
      <b-table
        hover
        :items="countryListItems"
        primary-key="id"
        :fields="countryListFields"
        sort-by="name"
        small
        head-variant="dark"
        :sort-compare="sortComparer"
      >
        <template #cell(name)="data">
          <b-link :to="data | countryUrl">
            {{ data.item.name }}
          </b-link>
        </template>
        <template #cell(publicHealthAuthorityRecommendation)="data">
          <PregnancyLactationCodeIcons :codes="data.item.publicHealthAuthorityRecommendation" />
        </template>
        <template #cell(lactationCounselingAndInformation)="data">
          <ProviderVisitLabel :codes="[data.value]" />
        </template>
        <template #cell(lactationContinuation)="data">
          <LactationContinuationLabel :code="data.value" />
        </template>
        <template #cell(subgroups)="data">
          <PregnancySubgroupsIcons :codes="data | ensureArray" />
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
      breadcrumbItems: [
        { text: 'Home', to: '/' },
        { text: 'Lactation', to: '/lacation' }
      ],
      countryListFields: [
        { key: 'name', label: 'Country', sortable: true },
        { key: 'publicHealthAuthorityRecommendation', label: 'Official recommendation', class: 'text-center' },
        { key: 'subgroups', class: 'text-center' },
        { key: 'lactationCounselingAndInformation', label: 'Provider visit', class: 'text-center', sortable: true },
        // { key: 'lactationContinuation', class: 'text-center', sortable: true },
        { key: 'wbRegion', label: 'Region', sortable: true },
        { key: 'wbIncomeLevelName', label: 'Income Level', sortable: true }
      ],
      countryListItems: []
    }
  },
  computed: {
    getMapStylesForPregnancyCode () {
      return this.countryListItems
        .reduce((mapStyles, countryListItem) => {
          if (countryListItem.publicHealthAuthorityRecommendation) {
            switch (countryListItem.publicHealthAuthorityRecommendation[0].rank) {
              case 1:
                mapStyles.push({ id: countryListItem.code, style: { fill: '#54BCD6' } })
                break
              case 2:
                mapStyles.push({ id: countryListItem.code, style: { fill: '#3D7632' } })
                break
              case 3:
                mapStyles.push({ id: countryListItem.code, style: { fill: '#FDB430' } })
                break
              case 4:
                mapStyles.push({ id: countryListItem.code, style: { fill: '#FA774A' } })
                break
              case 5:
                mapStyles.push({ id: countryListItem.code, style: { fill: '#9B001D' } })
                break
            }
          }
          return mapStyles
        }, [])
    }
  },
  created () {
    this.countryListItems = this.$store.state.coreData.countries
      .reduce((result, country) => {
        const outputRow = {
          id: country.id,
          name: country.name,
          code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
          subgroups: country.authorities
            ? (country.authorities.slice(-1)[0].policies
                ? country.authorities.slice(-1)[0].policies.slice(-1)[0].pregnancyQualifications
                : undefined)
            : undefined,
          publicHealthAuthorityRecommendation: this.$root.$getMostPermissiveLactationCode(country),
          // lactationContinuation: country.authorities
          //   ? (country.authorities.slice(-1)[0].policies
          //       ? country.authorities.slice(-1)[0].policies.slice(-1)[0].lactationContinuationAfterVaccine
          //       : undefined)
          //   : undefined,
          lactationCounselingAndInformation: country.authorities
            ? (country.authorities.slice(-1)[0].policies
                ? country.authorities.slice(-1)[0].policies.slice(-1)[0].lactationCounselingAndInformation
                : undefined)
            : undefined,
          wbRegion: country.wbRegion,
          wbIncomeLevelName: country.wbIncomeLevelName,
          wbIncomeLevelSort: country.wbIncomeLevelSort
        }
        result.push(outputRow)
        return result
      }, [])
  },
  methods: {
    sortComparer (aRow, bRow, key, sortDesc, formatter, compareOptions, compareLocale) {
      switch (key) {
        case 'name':
          if (aRow.name === 'Global') { return -1 }
          if (bRow.name === 'Global') { return 1 }
          return aRow.name.localeCompare(bRow.name)
        case 'wbIncomeLevelName':
          if (aRow.wbIncomeLevelSort < bRow.wbIncomeLevelSort) { return -1 }
          if (aRow.wbIncomeLevelSort > bRow.wbIncomeLevelSort) { return 1 }
          return 0
        default:
          return undefined
      }
    }
  }
}
</script>

<style scoped>
.legend {max-width: 600px; margin: auto}
.legend-items {display: flex; flex: row wrap; border: 0.5px solid #E0E0E0}
.legend-color {height: 2rem; width: 2rem; margin: 0.2rem;}
</style>
