<template>
  <b-container>
    <b-row>
      <GlobalMap :country-styles="getCountries()" />
    </b-row>
  </b-container>
</template>

<script>
export default {
  methods: {
    getCountries () {
      return [{ id: 'us', style: { fill: '#FF0000' } }, { id: 'gb', style: { fill: '#FF0000' } }, { id: 'cn', style: { fill: '#FF0000' } }, { id: 'mx', style: { fill: '#00FF00' } }]
    }
  }
}
</script>
