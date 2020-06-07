const state = {
  cascadeOptions: [{
    'value': 'stocks',
    'label': '股票类',
    'children': [{
      'value': 'equityLong',
      'label': '股票多头'
    }, {
      'value': 'alpha',
      'label': 'Alpha'
    }, {
      'value': 'augmentationIndex',
      'label': '指数增强'
    }, {
      'value': 'dayT0',
      'label': '日内T0'
    }, {
      'value': 'straddle',
      'label': '套利'
    }, {
      'value': 'other_stock',
      'label': '其他'
    }]
  }, {
    'value': 'futures',
    'label': '期货类',
    'children': [{
      'value': 'fundamentals',
      'label': '基本面驱动'
    }, {
      'value': 'logic',
      'label': '基于逻辑',
      'children': [{
        'value': 'traditionTrend',
        'label': '传统趋势'
      }, {
        'value': 'crossSection',
        'label': '截面策略'
      }, {
        'value': 'publicSentiment',
        'label': '舆情策略'
      }, {
        'value': 'inDay',
        'label': '日内策略'
      }, {
        'value': 'multiFactor',
        'label': '多因子'
      }]
    }, {
      'value': 'machineLearning',
      'label': '机器学习'
    }, {
      'value': 'hiFreqStrategy',
      'label': '高频策略'
    }, {
      'value': 'arbitrage',
      'label': '套利'
    }, {
      'value': 'other_future',
      'label': '其他'
    }]
  }, {
    'value': 'options',
    'label': '期权类'
  }, {
    'value': 'bonds',
    'label': '债券类'
  }, {
    'value': 'macroHedges',
    'label': '宏观对冲类'
  }, {
    'value': 'others',
    'label': '其他'
  }, {
    'value': 'combine',
    'label': '组合基金类',
    'children': [{
      'value': 'fof',
      'label': 'FOF'
    }, {
      'value': 'mom',
      'label': 'MOM'
    }]
  }],
  strategyTranslation: {
    'equityLong': '股票-多头',
    'alpha': '股票-Alpha',
    'augmentationIndex': '股票-指数增强',
    'dayT0': '股票-日内T0',
    'straddle': '股票-套利',
    'other_stock': '股票-其他',
    'fundamentals': '期货-基本面驱动',
    'traditionTrend': '期货-基于逻辑-传统趋势',
    'crossSection': '期货-基于逻辑-截面策略',
    'publicSentiment': '期货-基于逻辑-舆情策略',
    'inDay': '期货-基于逻辑-日内策略',
    'multiFactor': '期货-基于逻辑-多因子',
    'machineLearning': '期货-机器学习',
    'hiFreqStrategy': '期货-高频策略',
    'arbitrage': '期货-套利',
    'other_future': '期货-其他',
    'options': '期权类',
    'bonds': '债券类',
    'macroHedges': '宏观对冲类',
    'others': '其他',
    'fof': '组合基金-FOF',
    'mom': '组合基金-MOM'
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
