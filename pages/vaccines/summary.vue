<template>
  <div>
    <h2>{{ _pageTitle }}</h2>
    <p>{{ _pageDescription }}</p>
    <b-table
      :items="vaccineList"
      primary-key="id"
      :fields="vaccineListFields"
      small
      hover
      sort-by="countryCount"
      sort-desc
    >
      <template #head(countryCount)>
        Countries <br> administering <br> <b-icon-info-circle v-b-popover.hover="'Indicates the number of countries which have ever administered this vaccine, according to Our World In Data.'" />
      </template>
      <template #cell(displayName)="data">
        <nuxt-link v-if="data.item.url" :to="`${data.item.url}`">
          <span style="font-size: 1.25rem">{{ data.value }}</span>
        </nuxt-link>
        <span v-else style="font-size: 1.25rem">{{ data.value }}</span>
      </template>
      <template #cell(pregnancy)="data">
        <PolicyPositionsIndicators
          v-if="data.item.countries.length > 0"
          :country-list-items="data.item.countries"
          :displayed-indicators="[1,2,3,4,5]"
          indicator-property="pregnancyCode"
          status-word="pregnant"
          hide-labels
          font-size="50%"
        />
      </template>
      <template #cell(lactation)="data">
        <PolicyPositionsIndicators
          v-if="data.item.countries.length > 0"
          :country-list-items="data.item.countries"
          :displayed-indicators="[1,2,3,4,5]"
          indicator-property="lactationCode"
          status-word="lactating"
          hide-labels
          font-size="50%"
        />
      </template>
    </b-table>
    <b-row class="mt-5">
      <h4>
        Color key
      </h4>
      <PolicyPositionsIndicators />
    </b-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      vaccineListFields: [
        { key: 'displayName', label: 'Name', sortable: true, class: 'align-middle' },
        { key: 'countryCount', label: 'Countries', class: 'text-center align-middle', sortable: true },
        { key: 'pregnancy', label: 'Pregnancy policy positions' },
        { key: 'lactation', label: 'Lactation policy positions' }
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
      return 'Maternal Covid-19 vaccination policy positions summary, by vaccine'
    },
    _pageDescription () {
      return 'This table shows a list of vaccines, along with the number of countries administering each one, and counts of the most recent, most permissive policy positions for both pregnancy and lactation.'
    },
    _pageImage () {
      return '/img/comit-dark-background.png'
    },
    vaccineList () {
      return this.vaccinesWithNonSpecific.reduce((results, vaccine) => {
        const result = {
          id: vaccine.id,
          displayName: vaccine.displayName,
          url: vaccine.url,
          countryCount: vaccine.countryCount,
          countries: vaccine.countries
            ? vaccine.countries.reduce((countryResults, country) => {
              return countryResults.concat({
                pregnancyCode: this.$root.$getMostRecentOrPermissivePolicy({ country, code: 'pregnancyCode', vaccineIds: [vaccine.id] })?.pregnancyCode,
                lactationCode: this.$root.$getMostRecentOrPermissivePolicy({ country, code: 'lactationCode', vaccineIds: [vaccine.id] })?.lactationCode
              })
            }, [])
            : []
        }
        results.push(result)
        return results
      }, [])
    },
    vaccines () {
      return this.$store.state.vaccines.filter(vaccine => vaccine.displayName)
        .map(vaccine => ({
          id: vaccine.id,
          displayName: vaccine.displayName,
          countryCount: vaccine.countries ? vaccine.countries.length : ' -',
          countries: vaccine.countries,
          url: `/vaccine/${vaccine.id}`
        }))
    },
    vaccinesWithNonSpecific () {
      const unspecifiedVaccine = {
        id: 'vaccines-non-specific',
        displayName: '(No vaccine product specified)',
        countryCount: 'Not applicable',
        countries: this.$store.state.countries.filter(country => country.wbRegion)
      }
      return [unspecifiedVaccine].concat(this.vaccines)
    }
  }

}
</script>
