<template>
  <div>
    <section>
      <h2>Covid-19 vaccination policies for pregnancy</h2>
      <div class="indicators d-flex text-center text-white">
        <div class="indicator recommended-bg">
          <h2>{{ keyIndicators.recommended }}</h2>
          <strong>
            Recommended for some or all
            <b-icon-info-circle v-b-popover.hover="'An explicit recommendation that some or all pregnant people should receive vaccination.'" />
          </strong>
        </div>
        <div class="indicator permitted-for-all-bg">
          <h2>{{ keyIndicators.permittedForAll }}</h2>
          <strong>
            Permitted
            <b-icon-info-circle v-b-popover.hover="'All pregnant people can receive, may receive, or can choose to receive vaccination.'" />
          </strong>
        </div>
        <div class="indicator permitted-with-qualifications-bg">
          <h2>{{ keyIndicators.permittedWithQualifications }}</h2>
          <strong>
            Permitted with qualifications
            <b-icon-info-circle v-b-popover.hover="'Only certain groups of pregnant people, e.g., pregnant health workers, pregnant people with underlying conditions, can, may, or can choose to receive vaccination.'" />
          </strong>
        </div>
        <div class="indicator not-recommended-with-exceptions-bg">
          <h2>{{ keyIndicators.notRecommendedWithExceptions }}</h2>
          <strong>
            Not recommended with exceptions
            <b-icon-info-circle v-b-popover.hover="'A statement stating pregnant people should not receive vaccination, with certain exceptions.'" />
          </strong>
        </div>
        <div class="indicator prohibited-bg">
          <h2>{{ keyIndicators.notRecommended }}</h2>
          <strong>
            Not recommended
            <b-icon-info-circle v-b-popover.hover="'Pregnant people should not receive the vaccine or vaccine is contraindicated.'" />
          </strong>
        </div>
      </div>
    </section>
    <section>
      <b-overlay show blur="1px" opacity="0.75" class="my-5">
        <b-row class="flex-column">
          <GlobalMap :country-list-items="countryListItems" default-fill-color="#A0A0A0" style-property="mostPermissivePregnancyCode" />
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
      <b-link to="#">
        <b-button variant="primary" to="/about/comit">
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
    }
  },
  computed: {
    keyIndicators () {
      return this.countryListItems
        .reduce((result, countryListItem) => {
          if (countryListItem.mostPermissivePregnancyCode && countryListItem.mostPermissivePregnancyCode.length === 1) {
            switch (countryListItem.mostPermissivePregnancyCode[0].rank) {
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
                result.notRecommended++
            }
          }
          return result
        }, { recommended: 0, permittedForAll: 0, permittedWithQualifications: 0, notRecommendedWithExceptions: 0, notRecommended: 0 })
    }
  },
  created () {
    this.countryListItems = this.$store.state.coreData.countries
      .reduce((result, country) => {
        const outputRow = {
          code: country.iso3166Alpha2Code ? country.iso3166Alpha2Code.toLowerCase() : undefined,
          mostPermissivePregnancyCode: this.$root.$getMostPermissiveCode(country, 'pregnancyCode')
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
