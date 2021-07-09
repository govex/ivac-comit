<template>
  <div>
    <b-sidebar
      id="country-filter"
      title="Countries"
      shadow
      backdrop
      backdrop-variant="dark"
    >
      <div class="p-3">
        <div class="d-flex justify-content-end align-items-baseline text-primary">
          Select
          <b-button-group size="sm">
            <b-button variant="link" @click="selectAllCountries">All</b-button> .
            <b-dropdown text="Regions" variant="link">
              <b-button variant="link" @click="selectWbRegionCountries('East Asia and Pacific')">East Asia and Pacific</b-button>
              <b-button variant="link" @click="selectWbRegionCountries('Europe and Central Asia')">Europe and Central Asia</b-button>
              <b-button variant="link" @click="selectWbRegionCountries('Latin America and Caribbean')">Latin America and Caribbean</b-button>
              <b-button variant="link" @click="selectWbRegionCountries('Middle East and North Africa')">Middle East and North Africa</b-button>
              <b-button variant="link" @click="selectWbRegionCountries('North America')">North America</b-button>
              <b-button variant="link" @click="selectWbRegionCountries('South Asia')">South Asia</b-button>
              <b-button variant="link" @click="selectWbRegionCountries('Sub-Saharan Africa')">Sub-Saharan Africa</b-button>
            </b-dropdown>
            <b-button variant="link" @click="selectNoneCountries">None</b-button>
          </b-button-group>
        </div>
        <hr>
        <b-form-group v-if="countriesForCheckboxes" v-slot="{ ariaDescribedby }">
          <b-form-checkbox-group
            id="countries-to-display"
            v-model="countriesToDisplay"
            :options="countriesForCheckboxes"
            :aria-describedby="ariaDescribedby"
            name="countries-to-display"
            class="d-flex flex-column"
          />
        </b-form-group>
      </div>
    </b-sidebar>
    <h2>
      Most recent policy positions by country, by vaccine for {{ code.code }}
      <span v-for="codeItem of otherCodes" :key="codeItem.code" class="text-muted" style="font-size: 1rem"><NuxtLink :to="`${codeItem.code}`">(switch to {{ codeItem.code }})</NuxtLink></span>
    </h2>
    <p>This table shows the most recent policy position, by country, for each vaccine.</p>
    <b-alert variant="warning" show>
      <b-icon-exclamation-circle />
      Only vaccines mentioned in more than one policy are displayed here.
    </b-alert>
    <b-table
      :items="countryListItems"
      :fields="countryListFields"
      primary-key="id"
      bordered
      small
      hover
    >
      <template #head()="data">
        <template v-if="data.column === 'name'">
          {{ data.label }}
          <b-button v-b-toggle.country-filter variant="link">
            <b-icon-filter v-b-popover.hover="'Select countries to display'" />
          </b-button>
        </template>
        <template v-else>
          <div class="rotate">
            <NuxtLink :to="`/vaccine/${data.field.key}`">
              {{ data.label }}
            </NuxtLink>
            <br>
            <span class="text-muted small">
              {{ data.field.policyCount }}
              countries
            </span>
          </div>
        </template>
      </template>
      <template #cell()="data">
        <template v-if="data.field.key === 'name'">
          <NuxtLink :to="`/country/${data.item.code ? data.item.code.toLowerCase() : data.item.id}`">
            {{ data.item.name }}
          </NuxtLink>
        </template>
        <template v-else>
          <div class="text-center">
            <component :is="code.component" :codes="data.item[data.field.key]" />
          </div>
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      codes: [
        { code: 'pregnancy', key: 'pregnancyCode', component: 'PregnancyLactationCodeIcons' },
        { code: 'lactation', key: 'lactationCode', component: 'PregnancyLactationCodeIcons' }
      ],
      countriesToDisplay: this.$store.state.coreData.countries.filter(country => country.name !== 'Global').map(country => country.id)
    }
  },
  computed: {
    code () {
      const codeItem = this.codes.find(codeItem => codeItem.code === this.$route.params.code)
      if (codeItem) {
        return codeItem
      }
      return undefined
    },
    countryListFields () {
      return [
        { key: 'name', label: 'Country / territory', sortable: true }
      ].concat(this.vaccines
        .map((vaccine) => {
          return {
            key: vaccine.id,
            label: vaccine.displayName,
            policyCount: this.countryListItems.reduce((count, countryItem) => {
              if (countryItem[vaccine.id]) {
                count++
              }
              return count
            }, 0)
          }
        }))
    },
    countryListItems () {
      return this.countriesNotGlobal
        .filter(country => this.countriesToDisplay.includes(country.id))
        .map((country) => {
          const countryListItem = {
            id: country.id,
            name: country.name,
            code: country.iso3166Alpha2Code
          }
          for (const vaccine of this.vaccines) {
            countryListItem[vaccine.id] = this.$root.$getMostRecentOrPermissivePolicy(country, this.code.key, [vaccine.id])?.[this.code.key]
          }
          return countryListItem
        })
    },
    countriesForCheckboxes () {
      return this.countriesNotGlobal
        .map((country) => {
          return { text: country.name, value: country.id }
        })
    },
    countriesNotGlobal () {
      return this.$store.state.coreData.countries
        .filter(country => country.name !== 'Global')
    },
    otherCodes () {
      return this.codes.filter(codeItem => codeItem.code !== this.code.code)
    },
    vaccines () {
      return this.$store.state.coreData.vaccines
        .slice()
        .filter((vaccine) => {
          return vaccine.policies && vaccine.policies.length > 1
        })
        .sort((vaccine1, vaccine2) => {
          return vaccine2.policies.length - vaccine1.policies.length
        })
    }
  },
  methods: {
    selectAllCountries () {
      this.countriesToDisplay = this.countriesForCheckboxes.map(country => country.value)
    },
    selectNoneCountries () {
      this.countriesToDisplay = []
    },
    selectWbRegionCountries (region) {
      this.countriesToDisplay = this.countriesNotGlobal
        .filter(country => country.wbRegion === region)
        .map(country => country.id)
    }
  }
}
</script>

<style scoped>
.rotate { width: 3em; height: 250px; text-orientation: mixed; writing-mode: vertical-rl; transform: rotate(180deg)}
</style>
