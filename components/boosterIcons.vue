<template>
  <div v-if="codes" class="d-inline">
    <template v-for="code of codes">
      <template v-if="code && code.value">
        <b-icon-check-all 
          v-if="code.value.startsWith('Recommended for all pregnant people')" 
          :key="code.value" 
          v-b-popover.hover.top="code.value"
          class="subgroup-icon"
        />
        <x-b-icon-asterisk v-if="code.value.startsWith('Recommended for high risk pregnancies')" :key="code.value" v-b-popover.hover.top="code.value" />
        <svg
          v-if="code.value.startsWith('Recommended for high risk pregnancies')"
          :key="code.value"
          v-b-popover.hover.top="'Recommended for pregnant people at high risk of transmission or serious disease'"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 -3 95 92"
          class="subgroup-icon"
        >
          <path d="M82.566,17.057c-8.994-8.993-23.572-8.991-32.563,0l-2.503,2.503l-2.504-2.503c-8.991-8.991-23.569-8.993-32.562,0  c-8.993,8.992-8.993,23.572-0.002,32.563l35.067,35.067L82.566,49.62C91.557,40.629,91.557,26.049,82.566,17.057z M68.344,53.026  H53.271V68.1h-12.05V53.026H26.148v-12.05h15.072V25.903h12.05v15.073h15.073V53.026z" />
        </svg>
      </template>
    </template>
  </div>
</template>

<script>
export default {
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
svg {height: 2em; width: 2em; }
</style>
