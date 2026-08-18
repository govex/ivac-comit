<template>
  <div class="d-flex flex-column">
    <div v-for="[date, events] of eventsByDate" :key="date">
      <policy-position-event-group :date="date" :events="events" />
    </div>
    <div class="row">
      <div class="col-2 border-top"></div>
      <div class="col-10"></div>
    </div>
  </div>
</template>

<script>
import policyPositionEventGroup from './policyPositionEventGroup.vue'
export default {
  components: { policyPositionEventGroup },
  props: {
    events: {
      type: Array,
      default() { return [] }
    }
  },
  computed: {
    eventsByDate () {
      return Object.entries(this.events
        .slice()
        .sort((a,b) => b.date.localeCompare(a.date))
        .reduce((result, ppe) => {
          if (Array.isArray(result[ppe.date])) {
            result[ppe.date].push(ppe)
          } else {
            result[ppe.date] = [ppe]
          }
          return result
        }, {}))
    }

  }
}

</script>