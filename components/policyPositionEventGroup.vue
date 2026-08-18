<template>
  <div class="row my-2">
    <div class="col-2 d-flex flex-column text-center">
      <span class="h4 text-muted">{{ date }}</span>
      <div class="flex-grow-1 col-6 border-right"></div>
    </div>
    <div class="col-10">
      <div v-for="event of events" :key="event.date + event.type" class="d-flex flex-row align-items-start">
        <span class="h5 mr-2">{{ eventTypes[event.type].label }}</span>
        <PregnancyLactationCodeLabels :codes="event.policy[eventTypes[event.type].field]"></PregnancyLactationCodeLabels>
        <div v-if="event.policy[eventTypes[event.type].field].length > 1">
          <b-icon-exclamation-circle-fill variant="danger" v-b-popover.hover="'Within the documents we reviewed, there is language that could be interpreted as indicating different policy positions'"></b-icon-exclamation-circle-fill> 
        </div>

        <!-- {{ event.policy[eventTypes[event.type].field] }} -->
      </div>
    </div>
  </div>
  <!-- <div class="d-flex flex-row">
    <div class="flex-fill d-flex flex-column border-right">
      <span class="h4 text-muted">{{ date }}</span>
    </div>
    <div class="flex-fill">
      <div v-for="event of events" :key="event.date + event.type">
        {{ eventTypes[event.type].label }}
        <PregnancyLactationCodeIcons :codes="event.policy[eventTypes[event.type].field]"></PregnancyLactationCodeIcons>
        <pregnancy-lactation-code-labels :codes="event.policy[eventTypes[event.type].field]"></pregnancy-lactation-code-labels>
        <b-alert v-if="event.policy[eventTypes[event.type].field].length > 1" variant="danger" class="my-3" show>
          Within the documents we reviewed, there is language that could be interpreted as indicating different policy positions
        </b-alert>
 -->
        <!-- {{ event.policy[eventTypes[event.type].field] }} -->
      <!-- </div>
    </div>

  </div> -->
</template>
<script>
import PregnancyLactationCodeIcons from './pregnancyLactationCodeIcons.vue'
import PregnancyLactationCodeLabels from './pregnancyLactationCodeLabels.vue'
export default {
    props: {
        date: {
            type: String,
            default() { return "unknown"; }
        },
        events: {
            type: Array,
            default() { return []; }
        }
    },
    data() {
        return {
            eventTypes: {
                "pregnancyPolicyPositionChange": { field: "pregnancyCode", label: "Pregnancy" },
                "lactationPolicyPositionChange": { field: "lactationCode", label: "Lactation" }
            }
        };
    },
    components: { PregnancyLactationCodeIcons, PregnancyLactationCodeLabels, PregnancyLactationCodeLabels }
}
</script>