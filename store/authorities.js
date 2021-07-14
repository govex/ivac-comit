export const state = () => {
  return []
}

export const mutations = {
  load (state, authorities) {
    state.push(...authorities)
  }
}
