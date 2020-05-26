const state = {
  viewOnly: false
}
const mutations = {
  ALTER_VIEW_ONLY: (state, viewState) => {
    state.viewOnly = viewState
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
