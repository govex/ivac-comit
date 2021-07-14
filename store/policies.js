export const state = () => {
  return []
}

export const mutations = {
  load (state, policies) {
    state.push(...policies)
  }
}
