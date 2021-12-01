<template>
  <div>
    <template v-if="policies && policies.length > 0">
      <b-table
        :fields="policyListFields"
        head-variant="dark"
        hover
        :items="policies"
        primary-key="id"
        responsive
        small
        sort-by="datePublished/lastUpdated"
        :sort-compare="$root.$listSortComparer"
        sort-desc
      >
        <template #head(documentType)>
          Document type <b-icon-info-circle v-b-popover.hover="'Indicates the type of document in which this policy position was observed.'" />
        </template>
        <template #head(vaccines)>
          Vaccines <b-icon-info-circle v-b-popover.hover="'Indicates any vaccines which were mentioned as part of this policy position.'" />
        </template>
        <template #head(pregnancyCode)>
          Pregnancy <b-icon-info-circle v-b-popover.hover="'Indicates the position of this policy on vaccination for pregnant people.'" />
        </template>
        <template #head(lactationCode)>
          Lactation <b-icon-info-circle v-b-popover.hover="'Indicates the position of this policy on vaccination for lactating people.'" />
        </template>
        <template #head(policyDate)>
          Date <b-icon-info-circle v-b-popover.hover="'The date this policy was published or updated.'" />
        </template>
        <template #cell(documentType)="data">
          <template v-if="data.value">
            <b-badge v-for="documentType of data.value" :key="documentType.rank">
              {{ documentType.value }}
            </b-badge>
          </template>
        </template>
        <template #cell(vaccines)="data">
          <template v-if="data.item.vaccinesNonSpecific">
            <div class="text-muted">
              (none specified)
            </div>
          </template>
          <template v-else-if="data.value">
            <div v-for="vaccine of data.value" :key="vaccine.id">
              <b-link :to="`/vaccine/${vaccine.id}`">
                <span style="font-size: 1.25rem">{{ vaccine.displayName }}</span>
              </b-link>
            </div>
          </template>
        </template>
        <template #cell(pregnancyCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
        </template>
        <template #cell(lactationCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
        </template>
        <template #cell(policyDate)="data">
          {{ data.item['datePublished/lastUpdated'] || 'unknown' }}
        </template>
        <template #cell(link)="data">
          <b-link v-if="data.value" :href="data.value" target="_blank">
            <b-icon-box-arrow-up-right v-b-popover.hover="'View this policy document in a new browser tab'" />
          </b-link>
          <b-icon-x-square v-else class="text-muted" v-b-popover.hover="'A link to this document is not available.'" />
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
    policies: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
      policyListFields: [
        { key: 'documentType', class: 'align-middle', sortable: true },
        { key: 'vaccines', class: 'align-middle' },
        { key: 'pregnancyCode', class: 'text-center align-middle', sortable: true },
        { key: 'lactationCode', class: 'text-center align-middle', sortable: true },
        { key: 'datePublished/lastUpdated', label: 'Date', class: 'align-middle', sortable: true },
        { key: 'link', label: '', class: 'text-center align-middle' }
      ]
    }
  }
}
</script>
