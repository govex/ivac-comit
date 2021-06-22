<template>
  <div>
    <b-alert variant="success" class="d-flex flex-row flex-nowrap justify-content-between align-items-baseline" show>
      <span>{{ filterText }}.</span>
      <span>
        <!-- <b-button v-if="filtering" variant="link" size="sm" :to="emptyRouteObject">
          clear
        </b-button> -->
        <b-button v-b-toggle.collapse-filter variant="primary" size="sm">
          <template v-if="!filtering">
            Filter by vaccine / policy position
          </template>
          <template v-else>
            Change vaccine / policy position filter
          </template>
        </b-button>
      </span>
    </b-alert>
    <b-sidebar
      id="collapse-filter"
      shadow
      title="Select filters"
      backdrop
      backdrop-variant="dark"
      @hidden="filterCancel"
    >
      <div class="p-3">
        <div class="text-right">
          <b-button v-if="filtering" variant="link" :to="emptyRouteObject">
            clear
          </b-button>
          <b-button variant="primary" class="mr-1" :to="routeObject">
            Apply
          </b-button>
          <b-button v-b-toggle.collapse-filter variant="outline-danger">
            Cancel
          </b-button>
        </div>

        <div>
          <div class="d-flex justify-content-between align-content-baseline">
            <strong>Vaccines</strong>
          </div>
          <b-form-group v-if="vaccines" v-slot="{ ariaDescribedby }">
            <b-form-radio-group
              id="vaccine-selection-filter"
              v-model="toBeSelectedVaccine"
              :options="vaccines"
              :aria-describedby="ariaDescribedby"
              name="vaccine"
              class="d-flex flex-column"
            />
          </b-form-group>
        </div>
        <div>
          <div class="d-flex justify-content-between align-items-baseline">
            <strong>Policy positions</strong>
            <b-button-group size="sm">
              <b-button variant="link" @click="selectAllPolicyPositions">
                select all
              </b-button> .
              <b-button variant="link" @click="selectNonePolicyPositions">
                none
              </b-button>
            </b-button-group>
          </div>
          <b-form-group v-if="policyPositions" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              id="recommendation-selection-filter"
              v-model="toBeSelectedPolicyPositions"
              :options="policyPositions"
              :aria-describedby="ariaDescribedby"
              name="recommendation-selection-filter"
              class="d-flex flex-column"
            />
          </b-form-group>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  props: {
    selectedVaccine: {
      type: String,
      required: false,
      default () {
        return 'all'
      }
    },
    selectedPolicyPositions: {
      type: Array,
      required: false,
      default () {
        return [1, 2, 3, 4, 5, 999]
      }
    }
  },
  data () {
    const vaccines = [{ value: 'all', text: 'All' }]
      .concat(this.$store.state.coreData.vaccines
        .map((vaccine) => {
          return { value: vaccine.id, text: vaccine.displayName }
        }))
    const toBeSelectedVaccine = this.selectedVaccine

    const policyPositions = [
      { text: 'Recommended for some or all', value: 1 },
      { text: 'Permitted', value: 2 },
      { text: 'Permitted with qualifications', value: 3 },
      { text: 'Not recommended but with exceptions', value: 4 },
      { text: 'Not recommended', value: 5 },
      { text: 'No policy position found', value: 999 }
    ]
    const toBeSelectedPolicyPositions = Array.from(this.selectedPolicyPositions)

    return { vaccines, toBeSelectedVaccine, policyPositions, toBeSelectedPolicyPositions }
  },
  computed: {
    emptyRouteObject () {
      return { query: {} }
    },
    routeObject () {
      const routeObject = { query: {} }
      if (this.toBeSelectedPolicyPositions.length < 6 && this.toBeSelectedPolicyPositions.length > 0) {
        routeObject.query.policyPositions = this.toBeSelectedPolicyPositions.join(',')
      }
      if (this.toBeSelectedVaccine !== 'all') {
        routeObject.query.vaccine = this.toBeSelectedVaccine
      }
      return routeObject
    },
    filtering () {
      return (this.selectedPolicyPositions.length < 6 || this.selectedVaccine !== 'all')
    },
    filterText () {
      if (this.selectedVaccine === 'all') {
        if (this.selectedPolicyPositions.length === 6) {
          return 'Showing the most permissive policy position for each country for all vaccines'
        } else {
          return 'Showing countries where the most permissive policy position for all vaccines is ' + this.selectedPolicyPositions
            .map((selectedPolicyPosition) => {
              const policyPosition = this.policyPositions
                .find(policyPosition => policyPosition.value === selectedPolicyPosition)
              if (policyPosition) { return '"' + policyPosition.text + '"' }
              return undefined
            }).join('; ')
        }
      } else if (this.selectedPolicyPositions.length === 6) {
        const vaccine = this.vaccines.find(vaccine => vaccine.value === this.selectedVaccine)
        if (vaccine) {
          return `Showing the most recent policy position for each country for ${vaccine.text}`
        } else {
          return 'The filtering system encountered an error. Please try reloading the page'
        }
      } else {
        const vaccine = this.vaccines.find(vaccine => vaccine.value === this.selectedVaccine)
        if (vaccine) {
          return `Showing countries where the most recent policy position for ${vaccine.text} is ` + this.selectedPolicyPositions
            .map((selectedPolicyPosition) => {
              const policyPosition = this.policyPositions
                .find(policyPosition => policyPosition.value === selectedPolicyPosition)
              if (policyPosition) { return '"' + policyPosition.text + '"' }
              return undefined
            }).join('; ')
        } else {
          return 'The filtering system encountered an error. Please try reloading the page'
        }
      }
    },
    selectedVaccineText () {
      if (this.selectedVaccine === 'all') {
        return 'all vaccines'
      } else {
        const vaccine = this.vaccines.find(vaccine => vaccine.value === this.selectedVaccine)
        if (vaccine) {
          return `${vaccine.text}`
        } else {
          return '[unknown vaccine]'
        }
      }
    }
  },
  methods: {
    selectAllPolicyPositions () {
      this.toBeSelectedPolicyPositions = [1, 2, 3, 4, 5, 999]
    },
    selectNonePolicyPositions () {
      this.toBeSelectedPolicyPositions = []
    },
    filterCancel () {
      this.toBeSelectedVaccine = this.selectedVaccine
      this.toBeSelectedPolicyPositions = this.selectedPolicyPositions
    }
  }
}
</script>

<style scoped>
  .click-tap:before {content: 'tap'}
  @media(hover:hover) {
    .click-tap:before {content: 'click'}
  }
</style>
