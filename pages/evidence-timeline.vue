<template>
  <div>
    <article>
      <h2>
        {{ _pageTitle }}
      </h2>
      <div class="mb-5">
        {{ _pageDescription }}
      </div>
    </article>
    <b-input-group prepend="Graph policies for:">
      <b-select :options="displayedPolicyTypes" v-model="selectedPolicyType" label="Graph policies for:"></b-select>
    </b-input-group>
    <div style="display: flex; flex-direction: column; align-items: stretch; justify-items: stretch;">
      <evidence-filter 
        :aspect-ratio=6
        :end-date="filterDateRange[1]"
        :evidence-timeline="evidenceTimeline" 
        :policy-timeline="policyTimeline" 
        :policy-type="selectedPolicyType" 
        :start-date="filterDateRange[0]" 
        style="font-family: sans-serif" 
        @change="(value) => displayedEvidenceTimeline = value"
      >
      </evidence-filter>
    </div>
    <!-- <b-img src="/img/sample-graph-image.png" fluid></b-img> -->
    <b-table id="drt"
      caption-top
      class="mt-2"
      :items="displayedEvidenceTimeline"
      :fields="evidenceListFields" 
      hover 
      responsive
      small
      sort-by="date"
      stacked="lg"
    >
      <template #table-caption>Items shown: {{ displayedEvidenceTimeline.length }}</template>
      <template #head()="data">
        {{ data.field.label }}
        <b-icon-info-circle v-if="data.field.description" v-b-popover.hover="data.field.description" />
      </template>
      <template #cell(date)="data">
        {{ data.value.toISOString().slice(0,10) }}
      </template>
      <template #cell(Title)="data">
        <b-link v-if="data.item.Url" :href="data.item.Url" target="_blank">
          {{ data.value }}
          <b-icon-box-arrow-up-right></b-icon-box-arrow-up-right>
        </b-link>
        <span v-else>{{ data.value }}</span>
        ({{ data.item.Author }})
      </template>
    </b-table>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  data () {
    return {
      filterDateRange: ["2021-03-13", "2022-06-30"],
      evidenceListFields: [
        { key: 'date', label: 'Date', description: 'Date of publication', class: 'align-start', sortable: true, tdClass: 'table-cell-date' },
        { key: 'Category', label: 'Category', description: 'Indicates the category of this evidence/recommendation', class: 'align-start', sortable: true },
        { key: 'Title', label: 'Title/Author', description: 'The title and author of this evidence/recommendation entry', class: 'align-start' },
        { key: 'Findings', label: 'Findings', description: 'A summary of the findings as they relate to COMIT', class: 'align-start' },
      ],
      selectedPolicyType: undefined
    }
  },
  async asyncData ({ $content }) {
    let evidenceTimeline, policyTimeline, policyTypes = []
    let selectedPolicyType = undefined
    try {
      evidenceTimeline = await $content('/data/comit-evidence-timeline')
        .fetch()
        .then(data => data.body
          .map((row, index) => {
            return {
              ...row,
              date: new Date(row.Date),
              index: index
            }
          })
          .sort((a, b) => a.date - b.date)
        )

      policyTimeline = await $content('/data/comit-v1')
        .fetch()
        .then(data => data.statsTimeline
          .map((row, index) => {
            return {
              ...row,
              date: new Date(row.date)
            }
          })
          .sort((a, b) => a.date - b.date)
        )

      policyTypes = await $content('/data/coding-config')
        .fetch()
        .then(data => data.comitCodingTypes
          .map((codingType, index) => {
            return {
              ...codingType,
              lookup: Object.fromEntries(Object.entries(codingType.lookup).map(([key, value]) => {
                return [key, codingType.codes[value]]
              }))
            }
          })
        )

    } finally {
      if (Array.isArray(policyTypes) && policyTypes.length > 0) {
        selectedPolicyType = policyTypes[0]
      }
      const displayedEvidenceTimeline = evidenceTimeline.slice()
      return { displayedEvidenceTimeline, evidenceTimeline, policyTimeline, policyTypes, selectedPolicyType }
    }
  },
  head () {
    return {
      title: this._pageTitle,
      meta: [
        { hid: 'description', name: 'description', content: this._pageDescription },
        { hid: 'twitter:title', name: 'twitter:title', content: this._pageTitle },
        { hid: 'twitter:description', name: 'twitter:description', content: this._pageDescription },
        { hid: 'twitter:image', name: 'twitter:image', content: this._pageImage },
        { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: this._pageTitle },
        { hid: 'og:title', property: 'og:title', content: this._pageTitle },
        { hid: 'og:description', property: 'og:description', content: this._pageDescription },
        { hid: 'og:url', property: 'og:url', content: this._pageUrl },
        { hid: 'og:image', property: 'og:image', content: this._pageImage },
        { hid: 'og:image:secure_url', property: 'og:image:secure_url', content: this._pageImage },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this._pageTitle }
      ]
    }
  },
  computed: {
    _pageTitle () {
      return "Timeline of Evidence and Recommendations"
    },
    _pageDescription () {
      return "The timeline below shows the distribution of national COVID-19 vaccine policies for pregnancy or lactation from March 13, 2021, to present day, color-coded according to COMIT score. Superimposed black lines indicate the publication dates of: (1) evidence of SARS-CoV-2 risk in pregnancy; (2) COVID-19 vaccine safety and effectiveness and newborn outcome research; and (3) WHO/SAGE COVID-19 vaccine recommendations. Detailed information on the research findings or recommendations can be found in the table below."
    },
    _pageImage () {
      return 'https://www.comitglobal.org/img/comit-dark-background.png'
    },
    displayedPolicyTypes () {
      return this.policyTypes.map(ct => {
        return { text: ct.label, value: ct }
      })
    }
  },
  beforeMount () {
    if (this.policyTypes.length > 0) {
      this.selectedPolicyType = this.policyTypes[0]
    }
  },
}
</script>

<style>
  .table-cell-date {
    min-width: 11ch
  }
</style>