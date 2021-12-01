<template>
  <div class="w-100">
    <template v-if="vaccineList">
      <b-table
        :fields="vaccineListFields"
        head-variant="dark"
        hover
        :items="vaccineList"
        primary-key="id"
        responsive
        small
        sort-by="displayName"
        :sort-compare="$root.$listSortComparer"
      >
        <template #head()="data">
          <span>{{ data.label }} {{ data.key }}</span>
          <b-icon-info-circle v-if="data.description" v-b-popover.hover="data.description" />
        </template>
        <template #cell(displayName)="data">
          <b-link :to="`/vaccine/${data.item.id}`">
            <span style="font-size: 1.25rem">{{ data.value }}</span>
          </b-link>
        </template>
        <template #cell(owidAdministration)="data">
          <span v-if="data.value" class="text-success"><b-icon-check-circle-fill v-b-popover.hover="'This vaccine has been administered in this country.'" /></span>
        </template>
        <template #cell(mostPermissivePregnancyCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
        </template>
        <template #cell(mostPermissiveLactationCode)="data">
          <PregnancyLactationCodeIcons v-if="data.value" :codes="data.value" />
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
    country: {
      type: Object,
      default () { return undefined }
    },
    authority: {
      type: Object,
      default () { return undefined }
    },
  },
  data () {
    return {
      fields: [
        { key: 'displayName', sortable: true, class: 'align-middle', label: 'Name', description: 'The name of the vaccine' },
        // { key: 'otherNames', sortable: false, class: 'align-middle', label: 'Other names', description: 'Additional names by which this vaccine may be known' },
        { key: 'owidAdministration', sortable: true, class: 'text-center align-middle', countryOnly: true, label: 'Administered', description: 'Indicates whether this vaccine has been administered in this country, according to Our World In Data.' },
        { key: 'mostPermissivePregnancyCode', sortable: true, class: 'text-center align-middle', label: 'Pregnancy', description: 'Indicates the most recent position where this vaccine is specifically mentioned for use during pregnancy.' },
        { key: 'mostPermissiveLactationCode', sortable: true, class: 'text-center align-middle', label: 'Lactation', description: 'Indicates the most recent position where this vaccine is specifically mentioned for use during lactation.' },
        { key: 'otherCountryCount', sortable: true, class: 'text-center align-middle', countryOnly: true, label: 'Other countries', description: 'Indicates how many other countries are administering this vaccine, according to Our World In Data.' },
        { key: 'date', sortable: true, class: 'text-right align-middle', label: 'Date', description: 'The date of the most recent position where this vaccine is specifically mentioned for use' },
      ]
    }
  },
  computed: {
    vaccineListFields () {
      if (this.country) {
        return this.fields
      } else {
        return this.fields.filter(f => !f.countryOnly)
      }
    },
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
          const phaPolicies = phas.flatMap(pha => pha.policies || [])
          const vaccines = phaPolicies.flatMap(policy => policy.vaccines || [])
          for (const vaccine of vaccines) {
            if (vaccine) {
              if (!vaccinesMap.has(vaccine.id)) {
                vaccinesMap.set(vaccine.id, { ...vaccine })
              }
            }
          }
        }
        if (vaccinesMap.size === 0) {
          return undefined
        }
        // now turn the map of vaccines into the list we need
        return Array.from(vaccinesMap.values()).map((vaccine) => {
          const selectedPregnancyPolicy = this.$root.$getMostRecentOrPermissivePolicy({ country: this.country, code: 'pregnancyCode', vaccineIds: [vaccine.id] })
          const selectedLactationPolicy = this.$root.$getMostRecentOrPermissivePolicy({ country: this.country, code: 'lactationCode', vaccineIds: [vaccine.id] })
          const dates = []
          selectedPregnancyPolicy ? dates.push(selectedPregnancyPolicy['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown') : null
          selectedLactationPolicy ? dates.push(selectedLactationPolicy['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown') : null
          dates.sort()
          return {
            id: vaccine.id,
            displayName: vaccine.displayName,
            otherNames: vaccine.otherNames,
            owidAdministration: vaccine.owidAdministration,
            mostPermissivePregnancyCode: selectedPregnancyPolicy ? selectedPregnancyPolicy.pregnancyCode : undefined,
            mostPermissiveLactationCode: selectedLactationPolicy ? selectedLactationPolicy.lactationCode : undefined,
            otherCountryCount: vaccine.countries ? vaccine.countries.length - 1 : 0,
            date: dates.pop()
          }
        })
      } else if (this.authority) {
        const vaccines = (this.authority.policies || []).flatMap(policy => policy.vaccines || [])
        if (vaccines.length === 0) {
          return undefined
        }
        const vaccinesMap = new Map()
        for (const vaccine of vaccines) {
          if (vaccine) {
            if (!vaccinesMap.has(vaccine.id)) {
              vaccinesMap.set(vaccine.id, { ...vaccine })
            }
          }
        }
        return Array.from(vaccinesMap.values()).map(vaccine => {
          const selectedPregnancyPolicy = this.$root.$getMostRecentOrPermissivePolicy({ authority: this.authority, code: 'pregnancyCode', vaccineIds: [vaccine.id] })
          const selectedLactationPolicy = this.$root.$getMostRecentOrPermissivePolicy({ authority: this.authority, code: 'lactationCode', vaccineIds: [vaccine.id] })
          const dates = []
          selectedPregnancyPolicy ? dates.push(selectedPregnancyPolicy['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown') : null
          selectedLactationPolicy ? dates.push(selectedLactationPolicy['datePublished/lastUpdated'] || policy2.dateAccessed || 'unknown') : null
          dates.sort()
          return {
            id: vaccine.id,
            displayName: vaccine.displayName,
            otherNames: vaccine.otherNames,
            owidAdministration: vaccine.owidAdministration,
            mostPermissivePregnancyCode: selectedPregnancyPolicy ? selectedPregnancyPolicy.pregnancyCode : undefined,
            mostPermissiveLactationCode: selectedLactationPolicy ? selectedLactationPolicy.lactationCode : undefined,
            otherCountryCount: vaccine.countries ? vaccine.countries.length - 1 : 0,
            date: dates.pop()
          }
        })
      } else {
        return undefined
      }
    }
  }
}
</script>
