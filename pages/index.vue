<template>
  <div>
    <section>
      <div class="text-center">
        <h5>How many countries / territories have policy positions on the use of COVID-19 vaccines in pregnancy?</h5>
      </div>
      <PolicyPositionsIndicators :country-list-items="countryListItems" indicator-property="mostPermissivePregnancyCode" :displayed-indicators="[1,2,3,4,5]" link="/pregnancy" />
    </section>
    <section>
      <b-overlay show blur="1px" opacity="0.75" class="my-5">
        <b-row class="flex-column">
          <GlobalMap :country-list-items="countryListItems" default-fill-color="#A0A0A0" :enable-popups="false" style-property="mostPermissivePregnancyCode" />
        </b-row>
        <template #overlay>
          <div class="text-center">
            <b-button to="/pregnancy" variant="primary" size="lg" prefetch>
              Explore the Data
            </b-button>
          </div>
        </template>
      </b-overlay>
    </section>
    <section>
      <h2>Covid-19 Maternal Immunization Tracker (COMIT)</h2>
      <p>
        As COVID-19 vaccines are being rolled out across the globe, many have wondered whether pregnant and lactating people can or should be vaccinated as part of broader immunization efforts. Countries have taken a variety of positions - ranging from highly restrictive policies that bar access to vaccines based on pregnancy or lactation status to widely permissive positions in which all pregnant or lactating people can receive vaccine, and in some cases, are recommended and encouraged to do so.
      </p>
      <p>
        The COVID-19 Maternal Immunization Tracker (COMIT) provides a global snapshot of public health policies that influence access to COVID-19 vaccines for pregnant and lactating people. Through maps, tables, and country profiles, COMIT provides regularly updated information on country policies and the recommendations of professional medical societies as they respond to the dynamic state of the pandemic and emerging evidence.
      </p>
      <b-button variant="primary" to="/about/comit">
        Learn more
      </b-button>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      countryListItems: []
    }
  },
  created () {
    this.countryListItems = this.$store.state.coreData.countries
      .reduce((result, country) => {
        if (country.wbRegion) {
          const mostPermissivePolicy = this.$root.$getMostRecentOrPermissivePolicy(country, 'pregnancyCode')
          const outputRow = {
            code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
            mostPermissivePregnancyCode: mostPermissivePolicy?.pregnancyCode
          }
          result.push(outputRow)
        }
        return result
      }, [])

    this.countryListItems.forEach((countryListItem) => {

    })
  }
}
</script>
