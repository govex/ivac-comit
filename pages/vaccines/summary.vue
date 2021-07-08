<template>
  <div>
    <h2>Vaccine Comparison</h2>
    <b-table
      :items="vaccineList"
      primary-key="id"
      :fields="vaccineListFields"
      small
      hover
      sort-by="countryCount"
      sort-desc
    >
      <template #cell(displayName)="data">
        <nuxt-link :to="`/vaccine/${data.item.id}`">
          {{ data.value }}
        </nuxt-link>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      vaccineListFields: [
        { key: 'displayName', label: 'Name', sortable: true },
        { key: 'countryCount', label: 'Countries', sortable: true },
        { key: 'pregnancy', label: 'Pregnancy policy positions' },
        { key: 'lactation', label: 'Lactation policy positions' }
      ]
    }
  },
  computed: {
    vaccineList () {
      return this.vaccines.reduce((results, vaccine) => {
        const result = {
          id: vaccine.id,
          displayName: vaccine.displayName,
          countryCount: vaccine.countries ? vaccine.countries.length : ' -',
          countries: vaccine.countries
            ? vaccine.countries.reduce((countryResults, country) => {
              return countryResults.concat({
                pregnancyCode: this.$root.$getMostRecentOrPermissivePolicy(country, 'pregnancyCode', [vaccine.id])?.pregnancyCode,
                lactationCode: this.$root.$getMostRecentOrPermissivePolicy(country, 'lactationCode', [vaccine.id])?.lactationCode
              })
            }, [])
            : []
        }
        results.push(result)
        return results
      }, [])
    },
    vaccines () {
      return this.$store.state.coreData.vaccines.filter(vaccine => vaccine.displayName)
    }
  }

}
</script>
