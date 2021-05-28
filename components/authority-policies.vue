<template>
  <div>
    <template v-if="policies && policies.length > 0">
      <b-table-simple>
        <b-thead>
          <b-tr>
            <b-th><b-icon-link /></b-th>
            <b-th>Type</b-th>
            <b-th>Vaccines Included</b-th>
            <b-th class="text-center">
              Vaccination while pregnant
            </b-th>
            <b-th class="text-center">
              Vaccination while breastfeeding
            </b-th>
            <b-th class="text-center">
              Published/Updated
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="policy of policies" :key="policy.id">
            <b-td>
              <b-link :href="policy.link" target="_blank">
                <b-button size="sm">
                  View <b-icon-box-arrow-up-right />
                </b-button>
              </b-link>
            </b-td>
            <b-td>
              <template v-if="policy.documentType">
                <span v-for="documentType of policy.documentType" :key="documentType.value">{{ documentType.value }}</span>
              </template>
            </b-td>
            <b-td>
              <template v-if="policy.vaccinesNonSpecific">
                <span class="text-muted">(none specified)</span>
              </template>
              <template v-else>
                <span v-for="vaccine of policy.vaccines" :key="vaccine.id">{{ vaccine.manufacturer }} {{ vaccine.name }}<br></span>
              </template>
            </b-td>
            <b-td :class="{'bg-warning': policy.pregnancyCode && policy.pregnancyCode.length > 1 }" class="text-center">
              <PregnancyLactationCodeIcons :codes="policy.pregnancyCode" />
            </b-td>
            <b-td :class="{'bg-warning': policy.lactationCode && policy.lactationCode.length > 1 }" class="text-center">
              <PregnancyLactationCodeIcons :codes="policy.lactationCode" />
            </b-td>
            <b-td class="text-center">
              <span v-if="policy['datePublished/lastUpdated']">{{ policy['datePublished/lastUpdated'] }}</span>
              <span v-else class="text-muted">unknown</span>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
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
  }
}
</script>
