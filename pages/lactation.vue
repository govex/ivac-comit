<template>
  <div>
    <section>
      <b-row class="flex-column">
        <h1>
          Covid-19 vaccine policies on lactation
          <span class="text-muted" style="font-size: 1rem"><b-link to="/pregnancy">(show policies on pregnancy)</b-link></span>
        </h1>
        <PregnancyFilter />
      </b-row>
    </section>
    <section>
      <b-row class="flex-column">
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
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="recommended legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Recommended for some or all
                  <b-icon-info-circle v-b-popover.hover="'An explicit recommendation that some or all lactating people should receive vaccination.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="permitted-for-all legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Permitted
                  <b-icon-info-circle v-b-popover.hover="'All lactating people can receive, may receive, or can choose to receive vaccination.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="permitted-with-qualifications legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Permitted with qualifications
                  <b-icon-info-circle v-b-popover.hover="'Only certain groups of lactating people, e.g., those at high risk of exposure, or with underlying conditions, can, may, or can choose to receive vaccination.'" />
                </span>
              </div>
            </div>
            <div class="d-flex flex-column">
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="not-recommended-with-exceptions legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Not recommended, but with exceptions
                  <b-icon-info-circle v-b-popover.hover="'A statement stating lactating people should not receive vaccination, with certain exceptions provided.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middlem mx-2">
                <svg class="prohibited legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  Not recommended
                  <b-icon-info-circle v-b-popover.hover="'Lactating people should not receive the vaccine or vaccine is contraindicated.'" />
                </span>
              </div>
              <div class="d-flex flex-row align-items-middle mx-2">
                <svg class="no-language legend-color" viewbox="0 0 20 20"><rect x="0" y="0" width="20" height="20" /></svg>
                <span>
                  No policy position found
                  <b-icon-info-circle v-b-popover.hover="'In instances where no policies or positions regarding lactation and vaccination could be found, or where no position was clearly established, e.g., &quot;if breastfeeding, talk to your doctor.&quot;'" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <h2>Countries</h2>
      <span>This list displays the most permissive policy / guidance from each country across amongst all vaccines. Note that the World Health Organization makes recommendations for specific vaccines; <b-link to="/authority/who">view them here</b-link></span>
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
        <template #cell(name)="data">
          <b-link :to="data | countryUrl">
            {{ data.item.name }}
          </b-link>
        </template>
        <template #cell(publicHealthAuthorityRecommendation)="data">
          <PregnancyLactationCodeIcons :codes="data.item.publicHealthAuthorityRecommendation" />
        </template>
        <template #cell(providerVisit)="data">
          <ProviderVisitLabel :codes="[data.value]" />
        </template>
        <!-- <template #cell(lactationContinuation)="data">
          <LactationContinuationLabel :code="data.value" />
        </template> -->
        <template #cell(subgroups)="data">
          <PregnancySubgroupsIcons :codes="data | ensureArray" />
        </template>
        <template #cell(wbIncomeLevelName)="data">
          {{ data.value ? data.value.replace(' income', '') : undefined }}
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
        { key: 'publicHealthAuthorityRecommendation', label: 'Official recommendation', class: 'text-center', sortable: true },
        { key: 'subgroups', class: 'text-center' },
        { key: 'providerVisit', label: 'Provider visit', class: 'text-center', sortable: true },
        { key: 'subgroups', label: 'Subgroups', class: 'text-center', sortable: true },
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
          if (countryListItem.inTransition) {
            mapStyles.push({ id: countryListItem.code, style: { stroke: '#FFFF00', strokeWidth: 7, strokeDasharray: ['10', '10'] } })
          }
          return mapStyles
        }, [])
    }
  },
  created () {
    this.countryListItems = this.$store.state.coreData.countries
      .reduce((result, country) => {
        if (country.wbRegion) {
          const outputRow = {
            id: country.id,
            name: country.name,
            code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
            inTransition: country.inTransition,
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
            providerVisit: country.authorities
              ? (country.authorities.slice(-1)[0].policies
                  ? country.authorities.slice(-1)[0].policies.slice(-1)[0].lactationCounselingAndInformation
                  : undefined)
              : undefined,
            wbRegion: country.wbRegion,
            wbIncomeLevelName: country.wbIncomeLevelName,
            wbIncomeLevelSort: country.wbIncomeLevelSort
          }
          result.push(outputRow)
        }
        return result
      }, [])
  }
}
</script>

<style scoped>
.legend {max-width: 600px; margin: auto}
.legend-items {display: flex; flex: row wrap; border: 0.5px solid #E0E0E0}
.legend-color {height: 2rem; width: 2rem; margin: 0.2rem;}
</style>
