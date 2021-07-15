<template>
  <div class="indicators d-flex text-center text-white" :style="{ fontSize: fontSize }">
    <component :is="indicatorIs" v-if="show1" :to="linkProps(1)" class="indicator recommended-bg text-center">
      <h2 v-if="showCounts">
        {{ keyIndicators.recommended }}
      </h2>
      <strong v-if="showLabels">
        Recommended for some or all
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`An explicit recommendation that some or all ${statusWord} people should receive vaccine.`" />
      </strong>
    </component>
    <component :is="indicatorIs" v-if="show2" :to="linkProps(2)" class="indicator permitted-for-all-bg">
      <h2 v-if="showCounts">
        {{ keyIndicators.permittedForAll }}
      </h2>
      <strong v-if="showLabels">
        Permitted
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`All ${statusWord} people can receive, may receive, or can choose to receive vaccine.`" />
      </strong>
    </component>
    <component :is="indicatorIs" v-if="show3" :to="linkProps(3)" class="indicator permitted-with-qualifications-bg">
      <h2 v-if="showCounts">
        {{ keyIndicators.permittedWithQualifications }}
      </h2>
      <strong v-if="showLabels">
        Permitted with qualifications
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`Only certain groups of ${statusWord} people, e.g., ${statusWord} health workers, ${statusWord} people with underlying conditions, can, may, or can choose to receive vaccine.`" />
      </strong>
    </component>
    <component :is="indicatorIs" v-if="show4" :to="linkProps(4)" class="indicator not-recommended-with-exceptions-bg">
      <h2 v-if="showCounts">
        {{ keyIndicators.notRecommendedWithExceptions }}
      </h2>
      <strong v-if="showLabels">
        Not recommended but with exceptions
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`A statement stating ${statusWord} people should not receive vaccine, with certain exceptions.`" />
      </strong>
    </component>
    <component :is="indicatorIs" v-if="show5" :to="linkProps(5)" class="indicator prohibited-bg">
      <h2 v-if="showCounts">
        {{ keyIndicators.notRecommended }}
      </h2>
      <strong v-if="showLabels">
        Not recommended
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`People who are ${statusWord} should not receive the vaccine or vaccine is contraindicated.`" />
      </strong>
    </component>
    <div v-if="showUnclear" class="indicator unclear-bg text-dark">
      <h2 v-if="showCounts">
        {{ keyIndicators.unclear }}
      </h2>
      <strong v-if="showLabels">
        Unclear
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="'Within the guidance document, there is language that could be interpreted as indicating different policy positions'" />
      </strong>
    </div>
    <component :is="indicatorIs" v-if="show999" :to="linkProps(999)" class="indicator no-language-bg">
      <h2 v-if="showCounts">
        {{ keyIndicators.noLanguage }}
      </h2>
      <strong v-if="showLabels">
        No position found
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`No positions regarding vaccinating ${statusWord} people could be found, or where no position was clearly established`" />
      </strong>
    </component>
    <!-- <div v-if="displayedIndicators.includes('total')" class="indicator bg-light text-dark">
      <h2 v-if="showCount">
        {{ keyIndicators.total }}
      </h2>
      <strong v-if="showLabels">
        Total
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="`The total number of countries with policies regarding ${statusWord} people.`" />
      </strong>
    </div> -->
    <div v-if="showInTransition" class="indicator in-transition-bg text-dark">
      <h2 v-if="showCounts">
        {{ keyIndicators.inTransition }}
      </h2>
      <strong v-if="showLabels">
        In transition
      </strong>
      <strong>
        <b-icon-info-circle v-b-popover.hover="'Policies are currently being revised'" />
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
    displayedIndicators: {
      type: Array,
      default () { return [1, 2, 3, 4, 5, 999, 'unclear', 'inTransition'] }
    },
    fontSize: {
      type: String,
      default () { return '1em' }
    },
    hideCounts: {
      type: Boolean,
      default () { return false }
    },
    hideLabels: {
      type: Boolean,
      default () { return false }
    },
    indicatorProperty: {
      type: String,
      default () { return 'mostPermissivePregnancyCode' }
    },
    link: {
      type: [Boolean, String],
      default () { return false }
    },
    statusWord: {
      type: String,
      default () { return 'pregnant' }
    }
  },
  data () {
    return {
      showCounts: this.hideCounts ? false : this.countryListItems.length > 0,
      showLabels: !this.hideLabels
    }
  },
  computed: {
    indicatorIs () {
      if (this.link) {
        return 'NuxtLink'
      } else {
        return 'div'
      }
    },
    keyIndicators () {
      return this.countryListItems
        .reduce((result, countryListItem) => {
          if (countryListItem.inTransition) {
            result.inTransition++
          }
          result.total++
          if (countryListItem[this.indicatorProperty]) {
            if (countryListItem[this.indicatorProperty].length === 1) {
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
            } else {
              result.unclear++
            }
          }
          result.noLanguage = result.total - result.notRecommended - result.notRecommendedWithExceptions - result.permittedWithQualifications - result.permittedForAll - result.recommended - result.unclear
          return result
        }, { recommended: 0, permittedForAll: 0, permittedWithQualifications: 0, notRecommendedWithExceptions: 0, notRecommended: 0, noLanguage: 0, unclear: 0, inTransition: 0, total: 0 })
    },
    show1 () {
      return this.displayedIndicators.includes(1)
    },
    show2 () {
      return this.displayedIndicators.includes(2)
    },
    show3 () {
      return this.displayedIndicators.includes(3)
    },
    show4 () {
      return this.displayedIndicators.includes(4)
    },
    show5 () {
      return this.displayedIndicators.includes(5)
    },
    show999 () {
      return this.displayedIndicators.includes(999) && (this.countryListItems.length === 0 || this.keyIndicators.noLanguage > 0)
    },
    showUnclear () {
      return this.displayedIndicators.includes('unclear') && this.keyIndicators.unclear > 0
    },
    showInTransition () {
      return this.displayedIndicators.includes('inTransition') && this.keyIndicators.inTransition > 0
    }
  },
  methods: {
    linkProps (indicator) {
      if (this.link) {
        const query = { policyPositions: indicator }
        if (this.link !== true) {
          return {
            path: this.link,
            query
          }
        } else {
          return { query }
        }
      } else {
        return undefined
      }
    }
  }
}
</script>

<style scoped>
.indicators { flex-flow: row wrap; justify-content: space-between}
.indicator { display: flex; flex: 1 1 0px; flex-flow: column; justify-content: space-between; align-content: center; padding: 1em 1em; margin: 0.5em; border-radius: 0.25rem }
.in-transition { border: 4px solid #FF00FF }
a {color: var(--white)}
a:hover {filter: brightness(80%); text-decoration: none;}
h2 { font-size: 3em; font-weight: bold }

@media (max-width: 800px) {
  .indicator { font-size: 75% }
}
@media (max-width: 600px) {
  .indicator { font-size: 50% }
}

</style>
