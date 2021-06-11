<template>
  <div class="d-inline" style="font-size: 1.4em">
    <template v-if="codes">
      <template v-for="code of codes">
        <b-icon-circle-fill :key="code.rank" v-b-popover.hover.top="code.value" :class="code.rank | variantClass" class="mx-1" />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    variantClass (value) {
      switch (value) {
        case 1:
          return 'recommended'
        case 2:
          return 'permitted-for-all'
        case 3:
          return 'permitted-with-qualifications'
        case 4:
          return 'not-recommended-with-exceptions'
        case 5:
          return 'prohibited'
        default:
          return 'no-language'
      }
    },
    popoverText (value) {
      switch (value) {
        case 1:
          return 'Recommended for some or all'
        case 2:
          return 'Permitted'
        case 3:
          return 'Permitted with qualifications'
        case 4:
          return 'Not recommended with exceptions'
        case 5:
          return 'Not recommended'
        default:
          return 'No policy position found'
      }
    }
  },
  props: {
    codes: {
      type: Array,
      required: true,
      default: () => { return [] }
    }
  }
}
</script>

<style scoped>
</style>
