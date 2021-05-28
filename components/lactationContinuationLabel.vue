<template>
  <div class="d-inline">
    {{ code | lactationContinuation }}
  </div>
</template>

<script>
export default {
  filters: {
    lactationContinuation (code) {
      if (code) {
        switch (code.rank) {
          case 1:
          case 2:
            return code.value
        }
        return '-'
      }
      return undefined
    }
  },
  props: {
    code: {
      type: Object,
      required: true,
      default () { return undefined }
    }
  }
}
</script>
