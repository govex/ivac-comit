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
      <template #head(owidAdministration)>
        Administered <b-icon-info-circle v-b-popover.hover="'Indicates whether this vaccine has been administered in this country, according to Our World In Data.'" />
      </template>
      <template #cell(owidAdministration)="data">
        <span v-if="data.value" class="text-success"><b-icon-check-circle-fill v-b-popover.hover="'This vaccine has been administered in this country.'" /></span>
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
      <template #head(otherCountryCount)>
        Other countries <b-icon-info-circle v-b-popover.hover="'Indicates how many other countries are administering this vaccine, according to Our World In Data.'" />
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  props: {
    country: {
      type: Object,
      default () { return undefined }
    }
  },
  data () {
    return {
      vaccineListFields: [
        { key: 'displayName', sortable: true },
        { key: 'otherNames' },
        { key: 'owidAdministration', sortable: true, class: 'text-center' },
        { key: 'mostPermissivePregnancyCode', sortable: true, class: 'text-center' },
        { key: 'mostPermissiveLactationCode', sortable: true, class: 'text-center' },
        { key: 'otherCountryCount', sortable: true }
      ]
    }
  },
  computed: {
    vaccineList () {
      if (this.country) {
        const vaccinesMap = new Map()
        // gather vaccines linked through OWID
        if (this.country.vaccines) {
          for (const vaccine of this.country.vaccines) {
            vaccinesMap.set(vaccine.id, { owidAdministration: true, ...vaccine })
          }
        }
        // gather additional vaccines identified in policies
        if (this.country.authorities) {
          const phas = this.country.authorities.filter(authority => authority.authorityType === 'Public Health Authority')
          const phaPolicies = phas.flatMap(pha => pha.policies)
          const vaccines = phaPolicies.flatMap(policy => policy.vaccines)
          for (const vaccine of vaccines) {
            if (!vaccinesMap.has(vaccine.id)) {
              vaccinesMap.set(vaccine.id, { ...vaccine })
            }
          }
        }
        // now turn the map of vaccines into the list we need
        return Array.from(vaccinesMap.values()).map((vaccine) => {
          return {
            id: vaccine.id,
            displayName: vaccine.displayName,
            otherNames: vaccine.otherNames,
            owidAdministration: vaccine.owidAdministration,
            mostPermissivePregnancyCode: this.$root.$getMostPermissiveCode(this.country, 'pregnancyCode', [vaccine.id]),
            mostPermissiveLactationCode: this.$root.$getMostPermissiveCode(this.country, 'lactationCode', [vaccine.id]),
            otherCountryCount: vaccine.countries ? vaccine.countries.length - 1 : 0
          }
        })
      } else {
        return []
      }
    }
  }
}
</script>
