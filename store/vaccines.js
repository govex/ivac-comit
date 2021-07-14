export const state = () => {
  return []
}

export const mutations = {
  load (state, vaccines) {
    state.push(...vaccines)
  }
}
