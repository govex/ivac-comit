<template>
  <div>
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
      <template #head(mostPermissivePregnancyCode)>
        Pregnancy <b-icon-info-circle v-b-popover.hover="'Indicates the most recent policy position where this vaccine is specifically mentioned for use during pregnancy.'" />
      </template>
      <template #cell(mostPermissivePregnancyCode)="data">
        <PregnancyLactationCodeIcons :codes="data.value" />
      </template>
      <template #head(mostPermissiveLactationCode)>
        Lactation <b-icon-info-circle v-b-popover.hover="'Indicates the most recent policy position where this vaccine is specifically mentioned for use during lactation.'" />
      </template>
      <template #cell(mostPermissiveLactationCode)="data">
        <PregnancyLactationCodeIcons :codes="data.value" />
      </template>
    </b-table>
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
        { key: 'mostPermissivePregnancyCode', sortable: true, class: 'text-center' },
        { key: 'mostPermissiveLactationCode', sortable: true, class: 'text-center' }
      ]
    }
  },
  computed: {
    vaccineList () {
      return []
    }
  }

}
</script>
