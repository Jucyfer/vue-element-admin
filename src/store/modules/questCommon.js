import axios from 'axios'
const state = {
  quest_CN_Map: {},
  quest_Meta_Map: {}
}
const mutations = {
  setQuestMap(state, map) {
    state.quest_CN_Map = map
  },
  setQuestMeta(state, map) {
    state.quest_Meta_Map = map
  }
}
const actions = {
  async init_quest_CN_Map(context) {
    const { data: resp } = await axios.get('/common/questions')
    context.commit('setQuestMap', resp)
  },
  async init_quest_Meta_Map(context) {
    const { data: resp } = await axios.get('/common/questype')
    context.commit('setQuestMeta', resp)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
