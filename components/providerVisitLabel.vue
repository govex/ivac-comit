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
          case 4:
          case 3:
            return 'Optional'
          case 2:
            return 'Recommended'
          case 1:
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
