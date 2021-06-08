<template>
  <div>
    <section>
      <h2>Covid-19 vaccination policies for pregnancy</h2>
      <div class="indicators d-flex text-center text-white">
        <div class="indicator recommended-bg">
          <h2>{{ keyIndicators.recommended }}</h2>
          <strong>Recommended for some or all</strong>
        </div>
        <div class="indicator permitted-for-all-bg">
          <h2>{{ keyIndicators.permittedForAll }}</h2>
          <strong>Permitted</strong>
        </div>
        <div class="indicator permitted-with-qualifications-bg">
          <h2>{{ keyIndicators.permittedWithQualifications }}</h2>
          <strong>Permitted with qualifications</strong>
        </div>
        <div class="indicator not-recommended-with-exceptions-bg">
          <h2>{{ keyIndicators.notRecommendedWithExceptions }}</h2>
          <strong>Not recommended with exceptions</strong>
        </div>
        <div class="indicator prohibited-bg">
          <h2>{{ keyIndicators.prohibited }}</h2>
          <strong>Not recommended</strong>
        </div>
      </div>
    </section>
    <section>
      <b-overlay show blur="1px" opacity="0.75" class="my-5">
        <b-row class="flex-column">
          <GlobalMap :country-styles="getMapStylesForPregnancyCode" default-fill-color="#A0A0A0" />
        </b-row>
        <template #overlay>
          <div class="text-center">
            <b-button to="/pregnancy" variant="primary" size="lg">
              Explore the Data
            </b-button>
          </div>
        </template>
      </b-overlay>
    </section>
    <section>
      <h2>Covid-19 Maternal Immunization Tracker (COMIT)</h2>
      <p>
        The COVID-19 Maternal Immunization Tracker (COMIT) provides a global snapshot of public health policies that shape access to COVID-19 vaccines for pregnant and lactating people. Countries around the world have taken a variety of positions - ranging from highly restrictive policies that bar access to vaccines based on pregnancy or lactation status to widely permissive positions in which all pregnant or lactating people can receive vaccines and, in some cases, are recommended and encouraged to do so. Through maps, tables, and country profiles, COMIT provides regularly updated information on country policies and the recommendations of professional medical societies as they respond to the dynamic state of the pandemic and emerging evidence.
      </p>
      <b-link to="#">
        <b-button variant="primary">
          Learn more
        </b-button>
      </b-link>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      countryListItems: []
      // keyIndicators: { recommended: 0, permittedForAll: 0, permittedWithQualifications: 0, notRecommendedWithExceptions: 0, prohibited: 0 }
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
          return mapStyles
        }, [])
    },
    keyIndicators () {
      return this.countryListItems
        .reduce((result, countryListItem) => {
          if (countryListItem.publicHealthAuthorityRecommendation && countryListItem.publicHealthAuthorityRecommendation.length === 1) {
            switch (countryListItem.publicHealthAuthorityRecommendation[0].rank) {
              case 1:
                result.recommended++
                break
              case 2:
                result.permittedForAll++
                break
              case 3:
                result.permittedWithQualifications++
                break
              case 4:
                result.notRecommendedWithExceptions++
                break
              case 5:
                result.prohibited++
            }
          }
          return result
        }, { recommended: 0, permittedForAll: 0, permittedWithQualifications: 0, notRecommendedWithExceptions: 0, prohibited: 0 })
    }
  },
  created () {
    // generate the country list, for the map
    this.countryListItems = this.$store.state.coreData.countries
      .reduce((result, country) => {
        const outputRow = {
          code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
          publicHealthAuthorityRecommendation: this.$root.$getMostPermissiveCode(country, 'pregnancyCode')
        }
        result.push(outputRow)
        return result
      }, [])

    this.countryListItems.forEach((countryListItem) => {

    })
  }
}
</script>

<style scoped>
.indicators { flex-flow: row wrap; justify-content: space-between}
.indicator { display: flex; flex: 1 1 0px; flex-flow: column; justify-content: space-between; align-content: center; padding: 2em 1em; margin: 0.5rem; border-radius: 1em }
</style>
