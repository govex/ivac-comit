<template>
  <div class="d-inline">
    <template v-for="code of codes">
      <template v-if="code.rank === 999">
        -
      </template>
      <template v-else>
        {{ code | providerVisit }}
      </template>
    </template>
  </div>
</template>

<script>
export default {
  filters: {
    providerVisit (code) {
      if (code) {
        switch (code.rank) {
          case 2:
          case 3:
            return 'Not required'
          case 4:
            return 'Recommended'
          case 5:
            return 'Required'
        }
        return '-'
      }
      return undefined
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
