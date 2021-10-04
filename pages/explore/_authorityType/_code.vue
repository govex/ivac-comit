<template>
  <div>
    <div v-if="authorityType && code">
      <section>
        <b-row class="flex-column">
          <h1>
            Covid-19 vaccine policies on {{ code.keyword }}
            <span v-for="codeItem of otherCodes" :key="codeItem.code" class="text-muted" style="font-size: 1rem"><NuxtLink :to="`${codeItem.code}`">(switch to {{ codeItem.code }})</NuxtLink></span>
          </h1>
          <PregnancyLactationFilter :selected-policy-positions="policyPositionFilters" :selected-vaccine="vaccinesFilters" @timeWarpDateChanged="filterTimeWarpDateChanged" />
        </b-row>
        <b-row class="flex-column">
          <client-only>
            <GlobalMap default-fill-color="#A0A0A0" :country-list-items="countryListItems" style-property="mostPermissiveCode" />
          </client-only>
        </b-row>
      </section>
      <section>
        <PolicyPositionsIndicators font-size="0.8em" :country-list-items="countryListItems" :status-word="code.keywordIndicators" :displayed-indicators="policyPositionFilters ? policyPositionFilters.concat('unclear') : undefined" indicator-property="mostPermissiveCode" />
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
                <PregnancyLactationCodeIcons v-if="vaccine[code.authorityPolicyKey]" :codes="vaccine[code.authorityPolicyKey]" />
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
          :fields="code.countryListFields"
          responsive
          sort-by="name"
          small
          head-variant="dark"
          :sort-compare="$root.$listSortComparer"
        >
          <template #head(name)>
            Country / territory <b-icon-info-circle v-b-popover.hover="'The country or territory name'" />
          </template>
          <template #head(mostPermissiveCode)>
            <template v-if="vaccinesFilters">
              Vaccination policy <b-icon-info-circle v-b-popover.hover="'The most recent policy found'" />
            </template>
            <template v-else>
              Vaccination policy <b-icon-info-circle v-b-popover.hover="'The most permissive policy found'" />
            </template>
          </template>
          <template #head(pregnancyProviderVisit)>
            Provider visit <b-icon-info-circle v-b-popover.hover="'What does the policy say about seeing a healthcare professional before vaccination?'" />
          </template>
          <template #head(lactationProviderVisit)>
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
              <span style="font-size: 1.25rem">{{ data.item.name }}</span>
            </b-link>
          </template>
          <template #cell(mostPermissiveCode)="data">
            <component :is="code.codeComponent" v-if="data.item.mostPermissiveCode" style="font-size: 1.4em" :codes="data.item.mostPermissiveCode" />
          </template>
          <template #cell(pregnancyProviderVisit)="data">
            <ProviderVisitLabel :codes="[data.value]" />
          </template>
          <template #cell(lactationProviderVisit)="data">
            <ProviderVisitLabel :codes="[data.value]" />
          </template>
          <template #cell(pregnancyTest)="data">
            <PregnancyTestLabel :codes="[data.value]" />
          </template>
          <template #cell(subgroups)="data">
            <componemt :is="code.subgroupComponent" :codes="data | ensureArray" />
          </template>
          <template #cell(wbIncomeLevelName)="data">
            {{ data.value ? data.value.replace(' income', '') : undefined }}
          </template>
        </b-table>
      </section>
    </div>
    <div v-else>
      Not found.
    </div>
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
      authorityTypes: [
        { key: 'public-health-authorities', label: 'Public Health Authorities', filterValue: 'Public Health Authority' },
        { key: 'regulatory-bodies', label: 'Regulatory Bodies', filterValue: 'Regulatory body' },
        { key: 'professional-societies', label: 'Professional Societies', filterValue: 'Professional society' }
      ],
      codes: [
        {
          authorityPolicyKey: 'mostRecentPregnancyCode',
          code: 'pregnancy',
          codeComponent: 'PregnancyLactationCodeIcons',
          countryListFields: [
            { key: 'name', label: 'Country', class: 'align-middle', sortable: true },
            { key: 'mostPermissiveCode', label: 'Vaccination Policy', class: 'text-center align-middle', sortable: true },
            { key: 'subgroups', class: 'text-center align-middle' },
            { key: 'pregnancyProviderVisit', class: 'text-center align-middle', sortable: true },
            { key: 'pregnancyTest', class: 'text-center align-middle', sortable: true },
            { key: 'wbRegion', label: 'Region', class: 'align-middle text-truncate', sortable: true },
            { key: 'wbIncomeLevelName', label: 'Income Level', class: 'align-middle text-truncate', sortable: true }
          ],
          keyword: 'pregnancy',
          keywordCapitalized: 'Pregnancy',
          keywordIndicators: 'pregnant',
          policyKey: 'pregnancyCode',
          subgroupComponent: 'PregnancySubgroupsIcons'
        },
        {
          authorityPolicyKey: 'mostRecentLactationCode',
          code: 'lactation',
          codeComponent: 'PregnancyLactationCodeIcons',
          countryListFields: [
            { key: 'name', label: 'Country', class: 'align-middle', sortable: true },
            { key: 'mostPermissiveCode', label: 'Vaccination Policy', class: 'text-center align-middle', sortable: true },
            { key: 'subgroups', label: 'Subgroups', class: 'text-center align-middle', sortable: true },
            { key: 'lactationProviderVisit', label: 'Provider visit', class: 'text-center align-middle', sortable: true },
            { key: 'wbRegion', label: 'Region', class: 'text-truncate align-middle', sortable: true },
            { key: 'wbIncomeLevelName', label: 'Income Level', class: 'text-truncate align-middle', sortable: true }
          ],
          keyword: 'lactation',
          keywordCapitalized: 'Lactation',
          keywordIndicators: 'lactating',
          policyKey: 'lactationCode',
          subgroupComponent: 'LactationSubgroupsIcons'
        }
      ],
      timeWarpDate: undefined
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
        { hid: 'og:url', property: 'og:url', content: this._pageUrl },
        { hid: 'og:image', property: 'og:image', content: this._pageImage },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: this._pageImage },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this._pageTitle }
      ]
    }
  },
  computed: {
    _pageTitle () {
      return this.code && this.authorityType
        ? `${this.authorityType.filterValue} ${this.code.keyword} policy explorer`
        : 'Not found'
    },
    _pageDescription () {
      return `Explore ${this.authorityType.filterValue.toLowerCase()} policies on Covid-19 vaccination during ${this.code.keyword}. Our interactive map presents the most permissive policy position by country, allowing you to filter for specific vaccines, policy positions, or even snapshots of the past.`
    },
    _pageImage () {
      return 'https://www.comitglobal.org/img/comit-dark-background.png'
    },
    _pageUrl () {
      return `https://www.comitglobal.org${this.$route.path}`
    },
    authorityType () {
      const authorityTypeItem = this.authorityTypes.find(item => item.key === this.$route.params.authorityType)
      if (authorityTypeItem) {
        return authorityTypeItem
      } else {
        return undefined
      }
    },
    code () {
      const codeItem = this.codes.find(codeItem => codeItem.code === this.$route.params.code)
      if (codeItem) {
        return codeItem
      }
      return undefined
    },
    countryListItems () {
      let countryListItems = this.$store.state.countries
        .reduce((result, country) => {
          if (country.wbRegion) {
            const mostRecentOrPermissivePolicy = this.$root.$getMostRecentOrPermissivePolicy({
              country,
              code: this.code.policyKey,
              vaccineIds: this.vaccinesFilters,
              beforeDate: this.timeWarpDate
            })
            const outputRow = {
              id: country.id,
              name: country.name,
              code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
              inTransition: country.inTransition,
              subgroups: mostRecentOrPermissivePolicy?.pregnancyQualifications,
              mostPermissiveCode: mostRecentOrPermissivePolicy?.[this.code.policyKey],
              pregnancyTest: mostRecentOrPermissivePolicy?.pregnancyTest,
              pregnancyProviderVisit: mostRecentOrPermissivePolicy?.pregnancyCounselingAndInformation,
              lactationProviderVisit: mostRecentOrPermissivePolicy?.lactationCounselingAndInformation,
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
          if (countryListItem.mostPermissiveCode) {
            return countryListItem.mostPermissiveCode.some(code => this.policyPositionFilters.includes(code.rank))
          } else {
            return false
          }
        })
      }
      if (this.filtering) {
        countryListItems = countryListItems.filter((countryListItem) => {
          if (countryListItem.mostPermissiveCode) {
            if (countryListItem.mostPermissiveCode[0].rank === 999) {
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
      return (this.vaccinesFilters?.length > 0 || this.policyPositionFilters?.length > 0)
    },
    otherCodes () {
      return this.codes.filter(codeItem => codeItem.code !== this.code.code)
    },
    policyPositionFilters () {
      return this.$route.query.policyPositions?.split(',').map(value => parseInt(value)) || undefined
    },
    vaccinesFilters () {
      return this.$route.query.vaccine
    },
    whoAuthority () {
      return this.$store.state.authorities.find(authority => authority.id === 'recFs2GvQUntKmKPz')
    },
    whoAuthorityVaccineRecommendations () {
      if (this.vaccinesFilters) {
        return this.$root.$getVaccineRecommendationsFromAuthority(this.whoAuthority, [this.vaccinesFilters])
      }
      return undefined
    }
  },
  methods: {
    filterTimeWarpDateChanged (newDate) {
      this.timeWarpDate = newDate
    }
  }
}
</script>

<style scoped>
.legend {max-width: 600px; margin: auto}
.legend-items {display: flex; flex: row wrap; border: 0.5px solid #E0E0E0}
.legend-color {height: 2rem; width: 2rem; margin: 0.2rem;}
</style>
