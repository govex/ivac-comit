<template>
  <div class="d-inline">
    <template v-for="code of codes">
      <b-badge :key="code.rank" class="mr-1 text-light" :class="code | variant">
        {{ code.value }}
      </b-badge>
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    variant (value) {
      switch (value?.rank) {
        case 1:
          return 'recommended-bg'
        case 2:
          return 'permitted-for-all-bg'
        case 3:
          return 'permitted-with-qualifications-bg'
        case 4:
          return 'not-recommended-with-exceptions-bg'
        case 5:
          return 'prohibited-bg'
        default:
          return 'no-language-bg'
      }
    }
  },
  props: {
    codes: {
      type: Array,
      default () { return [] }
    }
  }
}
</script>
