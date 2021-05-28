<template>
  <div class="d-inline">
    <template v-if="codes">
      <template v-for="code of codes">
        <b-icon-circle-fill :key="code.rank" v-b-popover.hover.top="code.value" :class="code.rank | variant" class="mx-1" />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    variant (value) {
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
