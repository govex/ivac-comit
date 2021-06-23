<template>
  <div class="d-inline">
    <template v-for="code of codes">
      {{ code.rank | flatten }}
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    flatten (value) {
      switch (value) {
        case 3:
          return 'Not required'
        case 2:
          return 'Not required'
        case 1:
          return 'Required'
        case 999:
          return '-'
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
