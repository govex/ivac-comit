<template>
  <div>
    <b-alert variant="success" class="d-flex flex-row flex-nowrap justify-content-between align-items-baseline" show>
      <span>Showing {{ policyPositionsText }} for each country {{ vaccinesText }}.</span>
      <span>
        <b-button v-if="filtering" variant="link" size="sm" :to="emptyRouteObject">
          clear
        </b-button>
        <b-button v-b-toggle.collapse-filter variant="primary" size="sm">
          change
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
        <div>
          <div class="d-flex justify-content-between align-content-baseline">
            <strong>Vaccines</strong>
          </div>
          <b-form-group v-if="vaccines" v-slot="{ ariaDescribedby }">
            <b-form-radio-group
              id="vaccine-selection-filter"
              v-model="vaccinesSelected"
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
              v-model="policyPositionsSelected"
              :options="policyPositions"
              :aria-describedby="ariaDescribedby"
              name="recommendation-selection-filter"
              class="d-flex flex-column"
            />
          </b-form-group>
        </div>
      </div>
      <div class="text-right p-3">
        <b-button variant="primary" class="mr-1" :to="routeObject">
          Apply
        </b-button>
        <b-button v-b-toggle.collapse-filter variant="outline-danger">
          Cancel
        </b-button>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  props: {
    selectedVaccines: {
      type: Array,
      required: false,
      default () {
        return ['all']
      }
    },
    selectedPolicyPositions: {
      type: Array,
      required: false,
      default () { return [1, 2, 3, 4, 5, 999] }
    }
  },
  data () {
    const vaccines = [{ value: 'all', text: 'All' }]
      .concat(this.$store.state.coreData.vaccines
        .map((vaccine) => {
          return { value: vaccine.id, text: vaccine.displayName }
        }))
    const vaccinesSelected = 'all'
    const policyPositions = [
      { text: 'Recommended for some or all', value: 1 },
      { text: 'Permitted', value: 2 },
      { text: 'Permitted with qualifications', value: 3 },
      { text: 'Not recommended but with exceptions', value: 4 },
      { text: 'Not recommended', value: 5 },
      { text: 'No policy position found', value: 999 }
    ]
    const policyPositionsSelected = Array.from(this.selectedPolicyPositions)
    return { vaccines, vaccinesSelected, policyPositions, policyPositionsSelected }
  },
  computed: {
    emptyRouteObject () {
      return { query: {} }
    },
    routeObject () {
      const routeObject = { query: {} }
      if (this.policyPositionsSelected.length < 6 && this.policyPositionsSelected.length > 0) {
        routeObject.query.policyPositions = this.policyPositionsSelected.join(',')
      }
      if (this.vaccinesSelected !== 'all') {
        routeObject.query.vaccines = this.vaccinesSelected
      }
      return routeObject
    },
    filtering () {
      return (this.selectedPolicyPositions.length > 0 || this.selectedVaccines.length > 0)
    },
    policyPositionsText () {
      if (this.selectedPolicyPositions.length === 0) { return 'the most permissive policy position' }
      if (this.selectedPolicyPositions.length === 1) {
        return '"' + this.policyPositions.find(policyPosition => policyPosition.value === this.selectedPolicyPositions[0]).text + '"'
      }
      return 'the most permissive of ' + this.selectedPolicyPositions.map((selectedPolicyPosition) => {
        const policyPosition = this.policyPositions.find(policyPosition => policyPosition.value === selectedPolicyPosition)
        if (policyPosition) { return '"' + policyPosition.text + '"' }
        return undefined
      }).join('; ')
    },
    vaccinesText () {
      if (this.selectedVaccines.length === 0) { return 'across all vaccines' }
      return 'for ' + this.selectedVaccines.map((selectedVaccine) => {
        const vaccine = this.vaccines.find(vaccine => vaccine.value === selectedVaccine)
        if (vaccine) { return vaccine.text }
        return undefined
      }).join('; ')
    }
  },
  created () {
    if (this.selectedPolicyPositions.length === 0) {
      this.selectAllPolicyPositions()
    } else {
      this.policyPositionsSelected = this.selectedPolicyPositions
    }
    if (this.selectedVaccines.length === 0) {
      this.vaccinesSelected = 'all'
    } else {
      this.vaccinesSelected = this.selectedVaccines[0]
    }
  },
  methods: {
    selectAllPolicyPositions () {
      this.policyPositionsSelected = [1, 2, 3, 4, 5, 999]
    },
    selectNonePolicyPositions () {
      this.policyPositionsSelected = []
    },
    filterCancel () {
      if (this.selectedVaccines.length === 0) {
        this.selectAllPolicyPositions()
      } else {
        this.policyPositionsSelected = this.selectedPolicyPositions
      }
      if (this.selectedVaccines.length === 0) {
        this.vaccinesSelected = 'all'
      } else {
        this.vaccinesSelected = this.selectedVaccines[0]
      }
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
