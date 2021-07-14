export const state = () => {
  return []
}

export const mutations = {
  load (state, countries) {
    state.push(...countries)
  }
}
