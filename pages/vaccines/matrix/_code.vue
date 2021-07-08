<template>
  <div>
    <h2>
      Most recent policy positions by country, by vaccine for {{ code.code }}
      <span v-for="codeItem of otherCodes" :key="codeItem.code" class="text-muted" style="font-size: 1rem"><NuxtLink :to="`${codeItem.code}`">(switch to {{ codeItem.code }})</NuxtLink></span>
    </h2>
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
        </template>
        <template v-else>
          <div class="rotate">
            {{ data.label }}
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
          <component :is="code.component" :codes="data.item[data.field.key]" />
          <!-- <PregnancyLactationCodeIcons :codes="data.item[data.field.key]" /> -->
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
      ]
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
            label: vaccine.displayName
          }
        }))
    },
    countryListItems () {
      return this.$store.state.coreData.countries
        .filter(country => country.name !== 'Global')
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
    otherCodes () {
      return this.codes.filter(codeItem => codeItem.code !== this.code.code)
    },
    vaccines () {
      return this.$store.state.coreData.vaccines
        .slice()
        .sort((vaccine1, vaccine2) => {
          return (vaccine2.countries ? vaccine2.countries.length : 0) -
            (vaccine1.countries ? vaccine1.countries.length : 0)
        })
    }
  }
}
</script>

<style scoped>
.rotate { width: 3em; height: 400px; text-orientation: mixed; writing-mode: vertical-rl; transform: rotate(180deg)}
</style>
