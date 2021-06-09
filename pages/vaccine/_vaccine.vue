<template>
  <div>
    <div v-if="vaccine">
      <b-row class="flex-column">
        <h1>{{ vaccine.manufacturer }} {{ vaccine.name }}</h1>
        <span v-if="vaccine.otherNames" class="text-muted">Also known as: {{ vaccine.otherNames }}</span>
      </b-row>
      <b-row class="my-5">
        <h2>
          {{ countryListItems.length }}
          <template v-if="countryListItems.length === 1">
            Country
          </template>
          <template v-else>
            Countries
          </template>
          Administering
          <b-icon-info-circle v-b-popover.hover="'Based upon information from Our World In Data'" />
        </h2>
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
          <template #cell(publicHealthAuthorityPregnancyRecommendation)="data">
            <PregnancyLactationCodeIcons :codes="data.item.publicHealthAuthorityPregnancyRecommendation" />
          </template>
          <template #cell(publicHealthAuthorityLactationRecommendation)="data">
            <PregnancyLactationCodeIcons :codes="data.item.publicHealthAuthorityLactationRecommendation" />
          </template>
        </b-table>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
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
  asyncData ({ params }) {
    let vaccineCode, vaccine, mostPermissivePregnancyCodes, mostPermissiveLactationCodes
    if (params.vaccine) {
      vaccineCode = params.vaccine
    }
    const countryListFields = [
      { key: 'name', label: 'Country', sortable: true },
      { key: 'publicHealthAuthorityPregnancyRecommendation', label: 'Pregnancy Recommendation', class: 'text-center' },
      { key: 'publicHealthAuthorityLactationRecommendation', label: 'Lactation Recommendation', class: 'text-center' },
      { key: 'wbRegion', label: 'Region' },
      { key: 'wbIncomeLevelName', label: 'Income Level', sortable: true }
    ]
    const countryListItems = []
    return { vaccineCode, vaccine, mostPermissivePregnancyCodes, mostPermissiveLactationCodes, countryListFields, countryListItems }
  },
  created () {
    this.vaccine = this.$store.state.coreData.vaccines.find(vaccine => vaccine.id === this.vaccineCode)
    this.countryListItems = (this.vaccine.countries
      ? this.vaccine.countries
        .reduce((result, country) => {
          const outputRow = {
            name: country.name,
            code: country.iso3166Alpha2Code,
            wbIncomeLevelName: country.wbIncomeLevelName,
            wbIncomeLevelCode: country.wbIncomeLevelCode,
            wbRegion: country.wbRegion,
            publicHealthAuthorityPregnancyRecommendation: this.$root.$getMostPermissiveCode(country, 'pregnancyCode'),
            publicHealthAuthorityLactationRecommendation: this.$root.$getMostPermissiveCode(country, 'lactationCode')
          }
          return result.concat(outputRow)
        }, [])
      : [])
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
</style>
