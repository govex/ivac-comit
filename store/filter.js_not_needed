export const state = () => ({
  vaccines: [],
  authorityTypes: [],
  recommendations: []
})

export const mutations = {
  updateVaccines (state, vaccines) {
    state.vaccines = vaccines
  },
  updateAuthorityTypes (state, authorityTypes) {
    state.authorityTypes = authorityTypes
  },
  updateCodes (state, recommendations) {
    state.recommendations = recommendations
  },
  setDefaults (state) {
    state.vaccines = this.$store.state.coreData.vaccines.map(vaccine => vaccine.id)
    state.authorityTypes = ['Public Health Authority']
    state.recommendations = [
      'Recommended',
      'Permitted for all',
      'Permitted with qualifications',
      'Not recommended but with exceptions',
      'Prohibited',
      'No Language'
    ]
  }
}
