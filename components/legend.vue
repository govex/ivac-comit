<template>
  <div class="d-flex flex-column">
    <div class="text-center">
      <h4>Legend</h4>
    </div>
    <div class="d-flex">
      <div class="mx-auto legend-items p-3">
        <div class="d-flex flex-column">
          <div class="d-flex flex-row align-items-middle mx-2">
            <b-icon-info-circle-fill class="recommended" />
            <b-icon-circle-fill class="recommended" />
            <span>
              Recommended for some or all
              <b-icon-info-circle v-b-popover.hover="'An explicit recommendation that some or all pregnant people should receive vaccine.'" />
            </span>
          </div>
          <div class="d-flex flex-row align-items-middle mx-2">
            <b-icon-circle-fill class="permitted-for-all" />
            <span>
              Permitted
              <b-icon-info-circle v-b-popover.hover="'All pregnant people can receive, may receive, or can choose to receive vaccine.'" />
            </span>
          </div>
          <div class="d-flex flex-row align-items-middle mx-2">
            <b-icon-circle-fill class="permitted-with-qualifications" />
            <span>
              Permitted with qualifications
              <b-icon-info-circle v-b-popover.hover="'Only certain groups of pregnant people, e.g., pregnant health workers, pregnant people with underlying conditions, can, may, or can choose to receive vaccine.'" />
            </span>
          </div>
        </div>
        <div class="d-flex flex-column">
          <div class="d-flex flex-row align-items-middle mx-2">
            <b-icon-circle-fill class="not-recommended-with-exceptions" />
            <span>
              Not recommended, but with exceptions
              <b-icon-info-circle v-b-popover.hover="'A statement stating pregnant people should not receive vaccine, with certain exceptions.'" />
            </span>
          </div>
          <div class="d-flex flex-row align-items-middlem mx-2">
            <b-icon-circle-fill class="prohibited" />
            <span>
              Not recommended
              <b-icon-info-circle v-b-popover.hover="'Pregnant people should not receive the vaccine or vaccine is contraindicated.'" />
            </span>
          </div>
          <div class="d-flex flex-row align-items-middle mx-2">
            <b-icon-circle-fill class="no-language" />
            <span>
              No policy position found
              <b-icon-info-circle v-b-popover.hover="'In instances where no policies or positions regarding pregnancy and vaccine could be found, or where no position was clearly established, e.g., &quot;if pregnant, talk to your doctor.&quot;'" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    displayedIndicators: {
      type: Array,
      default () { return [1, 2, 3, 4, 5, 999, 'inTransition'] }
    }
  }
}
</script>
