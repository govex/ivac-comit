export const state = () => ({
  countries: [],
  authorities: [],
  policies: [],
  vaccines: []
})

export const mutations = {
  load (state, data) {
    state.countries = data.countries
    state.authorities = data.authorities
    state.policies = data.policies
    state.vaccines = data.vaccines
  }
}

export const getters = {
  country: ({ state }) => (id) => {
    return state.coreData.countries.find(country => (country.iso3166Alpha2Code === id || country.iso3166Alphae3Code === id))
  }
}