<template>
  <div>
    <template v-if="vaccineList && vaccineList.length > 0">
      <b-table
        hover
        :items="vaccineList"
        primary-key="id"
        :fields="vaccineListFields"
        sort-by="displayName"
        small
        head-variant="dark"
        :sort-compare="$root.$listSortComparer"
      >
        <template #head(displayName)>
          Name <b-icon-info-circle v-b-popover.hover="'The name of the vaccine'" />
        </template>
        <template #cell(displayName)="data">
          <b-link :to="`/vaccine/${data.item.id}`">
            {{ data.value }}
          </b-link>
        </template>
        <template #head(otherNames)>
          Other names <b-icon-info-circle v-b-popover.hover="'Additional names by which this vaccine may be known'" />
        </template>
        <template #head(mostRecentPregnancyCode)>
          Pregnancy <b-icon-info-circle v-b-popover.hover="'Indicates the most recent policy position where this vaccine is specifically mentioned for use during pregnancy'" />
        </template>
        <template #cell(mostRecentPregnancyCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
        </template>
        <template #head(mostRecentLactationCode)>
          Lactation <b-icon-info-circle v-b-popover.hover="'Indicates the most recent policy position where this vaccine is specifically mentioned for use during lactation'" />
        </template>
        <template #cell(mostRecentLactationCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
        </template>
        <template #head(policyDate)>
          Date <b-icon-info-circle v-b-popover.hover="'Indicates the date on which this policy position was published'" />
        </template>
      </b-table>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    authority: {
      type: Object,
      default () {}
    }
  },
  data () {
    return {
      vaccineListFields: [
        { key: 'displayName', sortable: true },
        { key: 'otherNames' },
        { key: 'mostRecentPregnancyCode', sortable: true, class: 'text-center' },
        { key: 'mostRecentLactationCode', sortable: true, class: 'text-center' },
        { key: 'policyDate', sortable: true, class: 'text-center' }
      ]
    }
  },
  computed: {
    vaccineList () {
      return this.$root.$getVaccineRecommendationsFromAuthority(this.authority)
    }
  }
}
</script>
