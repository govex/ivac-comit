<template>
  <div>
    <h2>Vaccine comparison summary</h2>
    <p>This table shows counts of most recent policy positions, by vaccine, for both pregnancy and lactation.</p>
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
        Countries <br> administering <br> <b-icon-info-circle v-b-popover.hover="'Indicates the number of countries in which each vaccine is presently being administered.'" />
      </template>
      <template #cell(displayName)="data">
        <nuxt-link :to="`/vaccine/${data.item.id}`">
          <span style="font-size: 1.25rem">{{ data.value }}</span>
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
    }
  }

}
</script>
