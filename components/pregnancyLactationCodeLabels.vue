<template>
  <div class="d-inline">
    <template v-for="code of codes">
      <b-badge :key="code" class="mr-1" :class="code | variant">
        {{ code }}
      </b-badge>
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    variant (value) {
      switch (value) {
        case 'Recommended':
          return 'recommended'
        case 'Permitted for all':
          return 'permitted-for-all'
        case 'Permitted with qualifications':
          return 'permitted-with-qualifications'
        case 'Not recommended with exceptions':
        case 'Not recommended but with exceptions':
          return 'not-recommended-with-exceptions'
        case 'Prohibited':
          return 'prohibited'
        default:
          return 'no-language'
      }
    }
  },
  props: {
    codes: {
      type: Array,
      required: true
    }
  }
}
</script>
