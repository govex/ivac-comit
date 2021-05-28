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
    <b-sidebar id="collapse-filter" shadow title="Select filters">
      <div class="p-3">
        <!-- <div class="row d-flex justify-content-between"> -->
        <div>
          <b-form-group v-slot="{ ariaDescribedby }" label="Select a vaccine:">
            <b-form-checkbox-group
              id="vaccine-selection-filter"
              v-model="vaccine.selected"
              :options="vaccine.options"
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
          <b-form-group v-slot="{ ariaDescribedby }" label="Select a recommendation:">
            <b-form-checkbox-group
              id="recommendation-selection-filter"
              v-model="recommendation.selected"
              :options="recommendation.options"
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
  data () {
    return {
      vaccine: {
        selected: this.$store.state.filter.vaccines,
        options: this.$store.state.coreData.vaccines
          .map(vaccine => ({ text: [vaccine.manufacturer, vaccine.name].join(' '), value: vaccine.id }))
      },
      // authorityType: {
      //   selected: this.$store.state.filter.authorityTypes,
      //   options: [
      //     { text: 'Regulatory Body', value: 'Regulatory Body' },
      //     { text: 'Public Health Authority', value: 'Public Health Authority' },
      //     { text: 'Professional Society', value: 'Professional Society' }
      //   ]
      // },
      recommendation: {
        selected: this.$store.state.filter.recommendations,
        options: [
          { text: 'Recommended', value: 'Recommended' },
          { text: 'Permitted for all', value: 'Permitted for all' },
          { text: 'Permitted with qualifications', value: 'Permitted with qualifications' },
          { text: 'Not recommended but with exceptions', value: 'Not recommended but with exceptions' },
          { text: 'Prohibited', value: 'Prohibited' },
          { text: 'No Language', value: 'No Language' }
        ]
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
