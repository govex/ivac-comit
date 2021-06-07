<template>
  <div>
    <div class="flex-row flex-nowrap align-items-center mb-3">
      <div>
        <b-button disabled variant="success">
          Recommending body: Public Health Authority <b-badge pill size="sm" variant="outline-warning">
            &times;
          </b-badge>
        </b-button>
        <b-button v-b-toggle.collapse-filter variant="primary">
          Change filters
        </b-button>
      </div>
    </div>
    <b-sidebar id="collapse-filter" shadow title="Select filters" show>
      <div class="p-3">
        <!-- <div class="row d-flex justify-content-between"> -->
        <div>
          <div class="d-flex justify-content-between align-content-baseline">
            <strong>Vaccines</strong>
          </div>
          <b-form-group v-if="vaccineOptions" v-slot="{ ariaDescribedby }">
            <b-form-radio-group
              id="vaccine-selection-filter"
              v-model="vaccinesSelected"
              :options="vaccineOptions"
              :aria-describedby="ariaDescribedby"
              name="vaccine"
              class="d-flex flex-column"
            />
          </b-form-group>
        </div>
        <!-- <div>
          <b-form-group v-slot="{ ariaDescribedby }" label="Select a recommending body:">
            <b-form-checkbox-group
              id="authoritytype-selection-filter"
              v-model="authorityType.selected"
              :options="authorityType.options"
              :aria-describedby="ariaDescribedby"
              name="authoritytype-selection-filter"
              class="d-flex flex-column"
            />
          </b-form-group>
        </div> -->
        <div>
          <div class="d-flex justify-content-between align-content-baseline">
            <strong>Policy positions</strong>
            <b-button-group size="sm">
              <b-button variant="link">
                select all
              </b-button> .
              <b-button variant="link">
                none
              </b-button>
            </b-button-group>
          </div>

          <b-form-group v-if="policyPositionsOptions" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
              id="recommendation-selection-filter"
              v-model="policyPositionsSelected"
              :options="policyPositionsOptions"
              :aria-describedby="ariaDescribedby"
              name="recommendation-selection-filter"
              class="d-flex flex-column"
            />
          </b-form-group>
        </div>
      </div>
      <div class="text-right p-3">
        <b-button variant="primary" class="mr-1">
          Apply
        </b-button>
        <b-button variant="outline-danger">
          Cancel
        </b-button>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  props: {
    vaccinesSelected: {
      type: String,
      required: false,
      default () {
        return 'all'
      }
    },
    vaccineOptions: {
      type: Array,
      required: false,
      default () {
        return [{ value: 'all', text: 'All' }]
          .concat(
            this.$store.state.coreData.vaccines
              .map((vaccine) => {
                return { value: vaccine.id, text: [vaccine.manufacturer, vaccine.name].join(' ') }
              }))
      }
    },
    policyPositionsSelected: {
      type: Array,
      required: false,
      default () { return [1, 2, 3, 4, 5, 999] }
    },
    policyPositionsOptions: {
      type: Array,
      required: false,
      default () {
        return [
          { text: 'Recommended for some or all', value: 1 },
          { text: 'Permitted', value: 2 },
          { text: 'Permitted with qualifications', value: 3 },
          { text: 'Not recommended but with exceptions', value: 4 },
          { text: 'Not recommended', value: 5 },
          { text: 'No policy position found', value: 999 }
        ]
      }
    }
  }

  // asyncData ({ params, $store }) {
  //   console.log('async data called on pregnancyFilter')
  //   const result = {
  //     params,
  //     vaccines: {
  //       title: 'Vaccines',
  //       selected: [],
  //       options: $store.state.coreData.vaccines
  //         .map(vaccine => ({ text: [vaccine.manufacturer, vaccine.name].join(' '), value: vaccine.id }))
  //     },
  //     policyPositions: {
  //       title: 'Policy positions',
  //       selected: [],
  //       options: [
  //         { text: 'Recommended for some or all', value: 1 },
  //         { text: 'Permitted', value: 2 },
  //         { text: 'Permitted with qualifications', value: 3 },
  //         { text: 'Not recommended but with exceptions', value: 4 },
  //         { text: 'Not recommended', value: 5 },
  //         { text: 'No policy position found', value: 999 }
  //       ]
  //     },
  //     authorityTypes: {
  //       selected: [],
  //       options: []
  //     }
  //   }
  //   console.log(result)
  //   return result
  // },

// console.log(params)
//     return {
//       vaccine: {
//         selected: this.$store.state.filter.vaccines,
//         options: this.$store.state.coreData.vaccines
//           .map(vaccine => ({ text: [vaccine.manufacturer, vaccine.name].join(' '), value: vaccine.id }))
//       },
//       // authorityType: {
//       //   selected: this.$store.state.filter.authorityTypes,
//       //   options: [
//       //     { text: 'Regulatory Body', value: 'Regulatory Body' },
//       //     { text: 'Public Health Authority', value: 'Public Health Authority' },
//       //     { text: 'Professional Society', value: 'Professional Society' }
//       //   ]
//       // },
//       recommendation: {
//         selected: this.$store.state.filter.recommendations,
//         options: [
//           { text: 'Recommended for some or all', value: 'Recommended' },
//           { text: 'Permitted', value: 'Permitted for all' },
//           { text: 'Permitted with qualifications', value: 'Permitted with qualifications' },
//           { text: 'Not recommended but with exceptions', value: 'Not recommended but with exceptions' },
//           { text: 'Not recommended', value: 'Prohibited' },
//           { text: 'No policy position found', value: 'No Language' }
//         ]
//       }
//     }
//   }
}
</script>

<style scoped>
  .click-tap:before {content: 'tap'}
  @media(hover:hover) {
    .click-tap:before {content: 'click'}
  }
</style>
