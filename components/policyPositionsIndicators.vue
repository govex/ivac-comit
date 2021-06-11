<template>
  <div class="indicators d-flex text-center text-white" :style="{ fontSize: fontSize }">
    <div v-if="displayedIndicators.includes(1)" class="indicator recommended-bg text-center">
      <h2 v-if="showCount">
        {{ keyIndicators.recommended }}
      </h2>
      <strong>
        Recommended for some or all
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`An explicit recommendation that some or all ${statusWord} people should receive vaccination.`" />
      </strong>
    </div>
    <div v-if="displayedIndicators.includes(2)" class="indicator permitted-for-all-bg">
      <h2 v-if="showCount">
        {{ keyIndicators.permittedForAll }}
      </h2>
      <strong>
        Permitted
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`All ${statusWord} people can receive, may receive, or can choose to receive vaccination.`" />
      </strong>
    </div>
    <div v-if="displayedIndicators.includes(3)" class="indicator permitted-with-qualifications-bg">
      <h2 v-if="showCount">
        {{ keyIndicators.permittedWithQualifications }}
      </h2>
      <strong>
        Permitted with qualifications
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`Only certain groups of ${statusWord} people, e.g., ${statusWord} health workers, ${statusWord} people with underlying conditions, can, may, or can choose to receive vaccination.`" />
      </strong>
    </div>
    <div v-if="displayedIndicators.includes(4)" class="indicator not-recommended-with-exceptions-bg">
      <h2 v-if="showCount">
        {{ keyIndicators.notRecommendedWithExceptions }}
      </h2>
      <strong>
        Not recommended but with exceptions
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`A statement stating ${statusWord} people should not receive vaccination, with certain exceptions.`" />
      </strong>
    </div>
    <div v-if="displayedIndicators.includes(5)" class="indicator prohibited-bg">
      <h2 v-if="showCount">
        {{ keyIndicators.notRecommended }}
      </h2>
      <strong>
        Not recommended
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`People who are ${statusWord} should not receive the vaccine or vaccine is contraindicated.`" />
      </strong>
    </div>
    <div v-if="displayedIndicators.includes(999)" class="indicator no-language-bg">
      <h2 v-if="showCount">
        {{ keyIndicators.noLanguage }}
      </h2>
      <strong>
        No position found
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`No positions regarding vaccinating ${statusWord} people could be found, or where no position was clearly established`" />
      </strong>
    </div>
    <div v-if="displayedIndicators.includes('inTransition') && keyIndicators.inTransition > 0" class="indicator in-transition-bg text-dark">
      <h2 v-if="showCount">
        {{ keyIndicators.inTransition }}
      </h2>
      <strong>
        In transition
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="'Policies are currently being revised.'" />
      </strong>
    </div>
    <div v-if="displayedIndicators.includes('total')" class="indicator bg-light text-dark">
      <h2 v-if="showCount">
        {{ keyIndicators.total }}
      </h2>
      <strong>
        Total
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`The total number of policies regarding ${statusWord} people.`" />
      </strong>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    countryListItems: {
      type: Array,
      default () { return [] }
    },
    indicatorProperty: {
      type: String,
      default () { return 'mostPermissivePregnancyCode' }
    },
    statusWord: {
      type: String,
      default () { return 'pregnant' }
    },
    displayedIndicators: {
      type: Array,
      default () { return [1, 2, 3, 4, 5, 999, 'inTransition', 'total'] }
    },
    hideCounts: {
      type: Boolean,
      default () { return false }
    },
    fontSize: {
      type: String,
      default () { return '1em' }
    }
  },
  data () {
    return {
      showCount: this.hideCounts ? false : this.countryListItems.length > 0
    }
  },
  computed: {
    keyIndicators () {
      return this.countryListItems
        .reduce((result, countryListItem) => {
          if (countryListItem.inTransition) {
            result.inTransition++
          }
          if (countryListItem[this.indicatorProperty] && countryListItem[this.indicatorProperty].length === 1) {
            result.total++
            switch (countryListItem[this.indicatorProperty][0].rank) {
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
                break
              case 999:
                result.noLanguage++
            }
          }
          return result
        }, { recommended: 0, permittedForAll: 0, permittedWithQualifications: 0, notRecommendedWithExceptions: 0, notRecommended: 0, noLanguage: 0, inTransition: 0, total: 0 })
    }
  }
}
</script>

<style scoped>
.indicators { flex-flow: row wrap; justify-content: space-between}
.indicator { display: flex; flex: 1 1 0px; flex-flow: column; justify-content: space-between; align-content: center; padding: 1em 1em; margin: 0.5em; border-radius: 0.25rem }
.in-transition { border: 4px solid #FF00FF }
h2 { font-size: 3em; font-weight: bold }
</style>
