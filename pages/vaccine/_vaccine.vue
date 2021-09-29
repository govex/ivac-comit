<template>
  <div>
    <template v-if="vaccine">
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
            <PregnancyLactationCodeIcons v-if="data.item.mostRecentPregnancyCode" :codes="data.item.mostRecentPregnancyCode" />
          </template>
          <template #cell(mostRecentLactationCode)="data">
            <PregnancyLactationCodeIcons v-if="data.item.mostRecentLactationCode" :codes="data.item.mostRecentLactationCode" />
          </template>
        </b-table>
      </b-row>
    </template>
    <template v-else>
      We couldn't find that vaccine.
    </template>
  </div>
</template>

<script>
export default {
  filters: {
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
        { key: 'name', label: 'Country', sortable: true },
        { key: 'mostRecentPregnancyCode', label: 'Pregnancy Recommendation', class: 'text-center', sortable: true },
        { key: 'mostRecentLactationCode', label: 'Lactation Recommendation', class: 'text-center', sortable: true },
        { key: 'wbRegion', label: 'Region', sortable: true },
        { key: 'wbIncomeLevelName', label: 'Income Level', sortable: true }
      ]
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
        { hid: 'og:image', property: 'og:image', content: this._pageImage },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: this._pageImage },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this._pageTitle }
      ]
    }
  },
  computed: {
    _pageTitle () {
      return this.vaccine ? this.vaccine.displayName + ' policies and guidance for maternal COVID-19 immunization' : 'not found'
    },
    _pageDescription () {
      return this.vaccine ? 'Learn about global policies and guidance related to ' + this.vaccine.displayName + ' for maternal COVID-19 immunization.' : 'not found'
    },
    _pageImage () {
      return '/img/comit-dark-background.png'
    },
    countryListItems () {
      return this.vaccine.countries
        ? this.vaccine.countries
          .reduce((result, country) => {
            const outputRow = {
              name: country.name,
              code: country.iso3166Alpha2Code,
              wbIncomeLevelName: country.wbIncomeLevelName,
              wbIncomeLevelSort: country.wbIncomeLevelSort,
              wbRegion: country.wbRegion,
              mostRecentPregnancyCode: this.$root.$getMostRecentOrPermissivePolicy({ country, code: 'pregnancyCode', vaccineIds: [this.vaccine.id] })?.pregnancyCode,
              mostRecentLactationCode: this.$root.$getMostRecentOrPermissivePolicy({ country, code: 'lactationCode', vaccineIds: [this.vaccine.id] })?.lactationCode
            }
            return result.concat(outputRow)
          }, [])
        : []
    },
    vaccine () {
      return this.$store.state.vaccines.find(vaccine => vaccine.id === this.vaccineId)
    },
    vaccineId () {
      return this.$route.params.vaccine
    }
  }
}
</script>
<style scoped>
</style>
