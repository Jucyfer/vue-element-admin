const state = {
  positionOptions: [{
    'value': 'p1',
    'label': '填报人'
  }, {
    'value': 'p2',
    'label': '投研'
  }, {
    'value': 'p3',
    'label': '市场'
  }, {
    'value': 'p4',
    'label': '合规风控'
  }, {
    'value': 'p5',
    'label': '公司高管'
  }, {
    'value': 'p6',
    'label': '公司法人'
  }, {
    'value': 'p7',
    'label': '基金经理'
  }],
  positionTranslation: {
    'p1': '填报人',
    'p2': '投研',
    'p3': '市场',
    'p4': '合规风控',
    'p5': '公司高管',
    'p6': '公司法人',
    'p7': '基金经理'
  }
}
const mutations = {}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
