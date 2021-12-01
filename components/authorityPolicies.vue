<template>
  <div>
    <template v-if="policies && policies.length > 0">
      <b-table
        :fields="policyListFields"
        head-variant="dark"
        hover
        :items="displayedPolicies"
        primary-key="id"
        responsive
        small
        sort-by="date"
        :sort-compare="$root.$listSortComparer"
        sort-desc
      >
        <template #head()="data">
          {{ data.field.label }}
          <b-icon-info-circle v-if="data.field.description" v-b-popover.hover="data.field.description" />
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
        <template #cell(subgroups)="data">
          <PregnancySubgroupsIcons :codes="data.value | ensureArray" />
        </template>
        <template #cell(pregnancyCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
        </template>
        <template #cell(lactationCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
        </template>
        <template #cell(booster)="data">
          <BoosterIcons :codes="data.value | ensureArray" />
        </template>
        <template #cell(date)="data">
          <span style="white-space: nowrap">{{ data.value }}</span>
        </template>
        <template #cell(link)="data">
          <b-link v-if="data.value" :href="data.value" target="_blank">
            <b-icon-box-arrow-up-right v-b-popover.hover="'View this resource in a new browser tab'" />
          </b-link>
          <b-icon-x-square v-else class="text-muted" v-b-popover.hover="'A link to this resource is not available.'" />
        </template>
        <template #row-details="row">
          <template v-if="row.item.isMediaArticle">
            <b-alert variant="warning" show><b-icon-triangle-fill /> This information was obtained from a media article, and may not accurately reflect the position of this organization.</b-alert>
          </template>
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
  filters: {
    ensureArray (value) {
      return Array.isArray(value) ? value : undefined
    },
  },
  props: {
    policies: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
      policyListFields: [
        { key: 'documentType', label: 'Document type', description: 'Indicates the type of resource reviewed.', class: 'align-middle', sortable: true },
        { key: 'vaccines', label: 'Vaccines', description: 'Indicates any vaccines which were mentioned as part of this resource.', class: 'align-middle' },
        { key: 'subgroups', label: 'Subgroups', description: 'Specific subgroups', class: 'align-middle' },
        { key: 'pregnancyCode', label: 'Pregnancy', description: 'Indicates the position of this resource on vaccination for pregnant people.', class: 'text-center align-middle', sortable: true },
        { key: 'lactationCode', label: 'Lacation', description: 'Indicates the position of this resource on vaccination for lactating people.', class: 'text-center align-middle', sortable: true },
        { key: 'booster', label: 'Booster', description: 'What does this resource say about getting a booster vaccination while pregnant?', class: 'text-center align-middle' },
        { key: 'date', label: 'Date', description: 'The date this policy was published or updated.', class: 'align-middle', sortable: true },
        { key: 'link', label: '', class: 'text-center align-middle' }
      ]
    }
  },
  computed: {
    displayedPolicies () {
      return this.policies.map(p => ({
        booster: p.booster,
        date: p['datePublished/lastUpdated'],
        documentType: p.documentType,
        isMediaArticle: (p.documentType || []).map(dt => dt.value).includes('Media article'),
        lactationCode: p.lactationCode,
        link: p.link,
        pregnancyCode: p.pregnancyCode,
        subgroups: p.pregnancyQualifications,
        vaccines: p.vaccines,
        _showDetails: (p.documentType || []).map(dt => dt.value).includes('Media article'),
      }))
    }
  }
}
</script>

<style>
.table-hover tbody .b-table-details tr:hover {
  color: unset;
  background-color: unset;
}
</style>
