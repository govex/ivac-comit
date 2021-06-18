<template>
  <div>
    <div v-if="vaccine">
      <b-row class="flex-column">
        <h1>{{ vaccine.displayName }}</h1>
        <span v-if="vaccine.otherNames" class="text-muted">Also known as: {{ vaccine.otherNames }}</span>
      </b-row>
      <b-row>
        <h2 class="mt-5">
          Policy positions summary
        </h2>
        <div class="w-100 my-4 d-flex flex-column align-items-start">
          <h4 class="col-2">
            Pregnancy
          </h4>
          <PolicyPositionsIndicators :country-list-items="countryListItems" indicator-property="mostRecentPregnancyCode" />
        </div>
        <div class="w-100 my-4 d-flex flex-column align-items-start">
          <h4 class="col-2">
            Lactation
          </h4>
          <PolicyPositionsIndicators :country-list-items="countryListItems" indicator-property="mostRecentLactationCode" />
        </div>
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
          :sort-compare="$root.$listSortComparer"
        >
          <template #head(name)>
            Country / territory<b-icon-info-circle v-b-popover.hover="'The country / territory name'" />
          </template>
          <template #head(mostRecentPregnancyCode)>
            Pregnancy policy <b-icon-info-circle v-b-popover.hover="'The most recent policy specifically mentioning this vacccine for people who are pregnant.'" />
          </template>
          <template #head(mostRecentLactationCode)>
            Lactation policy <b-icon-info-circle v-b-popover.hover="'The most recent policy specifically mentioning this vaccine for people who are lactating.'" />
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
          <template #cell(mostRecentPregnancyCode)="data">
            <PregnancyLactationCodeIcons :codes="data.item.mostRecentPregnancyCode" />
          </template>
          <template #cell(mostRecentLactationCode)="data">
            <PregnancyLactationCodeIcons :codes="data.item.mostRecentLactationCode" />
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
    let vaccineCode, vaccine, vaccineName, mostPermissivePregnancyCodes, mostPermissiveLactationCodes
    if (params.vaccine) {
      vaccineCode = params.vaccine
    }
    const countryListFields = [
      { key: 'name', label: 'Country', sortable: true },
      { key: 'mostRecentPregnancyCode', label: 'Pregnancy Recommendation', class: 'text-center', sortable: true },
      { key: 'mostRecentLactationCode', label: 'Lactation Recommendation', class: 'text-center', sortable: true },
      { key: 'wbRegion', label: 'Region', sortable: true },
      { key: 'wbIncomeLevelName', label: 'Income Level', sortable: true }
    ]
    const countryListItems = []
    return { vaccineCode, vaccine, vaccineName, mostPermissivePregnancyCodes, mostPermissiveLactationCodes, countryListFields, countryListItems }
  },
  head () {
    return {
      title: `COMIT: ${this.vaccineName}`
    }
  },
  created () {
    this.vaccine = this.$store.state.coreData.vaccines.find(vaccine => vaccine.id === this.vaccineCode)
    if (this.vaccine) {
      this.vaccineName = this.vaccine.displayName
    }
    this.countryListItems = (this.vaccine.countries
      ? this.vaccine.countries
        .reduce((result, country) => {
          const outputRow = {
            name: country.name,
            code: country.iso3166Alpha2Code,
            wbIncomeLevelName: country.wbIncomeLevelName,
            wbIncomeLevelSort: country.wbIncomeLevelSort,
            wbRegion: country.wbRegion,
            mostRecentPregnancyCode: this.$root.$getMostPermissiveCode(country, 'pregnancyCode', [this.vaccine.id]),
            mostRecentLactationCode: this.$root.$getMostPermissiveCode(country, 'lactationCode', [this.vaccine.id])
          }
          return result.concat(outputRow)
        }, [])
      : [])
  }
}
</script>
<style scoped>
</style>
