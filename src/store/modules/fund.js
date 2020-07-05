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
    'label': '债权类'
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
    'bonds': '债权类',
    'macroHedges': '宏观对冲类',
    'others': '其他',
    'fof': '组合基金-FOF',
    'mom': '组合基金-MOM'
  },
  strategyFilterArray: [
    { text: '股票-多头', value: 'equityLong' },
    { text: '股票-Alpha', value: 'alpha' },
    { text: '股票-指数增强', value: 'augmentationIndex' },
    { text: '股票-日内T0', value: 'dayT0' },
    { text: '股票-套利', value: 'straddle' },
    { text: '股票-其他', value: 'other_stock' },
    { text: '期货-基本面驱动', value: 'fundamentals' },
    { text: '期货-基于逻辑-传统趋势', value: 'traditionTrend' },
    { text: '期货-基于逻辑-截面策略', value: 'crossSection' },
    { text: '期货-基于逻辑-舆情策略', value: 'publicSentiment' },
    { text: '期货-基于逻辑-日内策略', value: 'inDay' },
    { text: '期货-基于逻辑-多因子', value: 'multiFactor' },
    { text: '期货-机器学习', value: 'machineLearning' },
    { text: '期货-高频策略', value: 'hiFreqStrategy' },
    { text: '期货-套利', value: 'arbitrage' },
    { text: '期货-其他', value: 'other_future' },
    { text: '期权类', value: 'options' },
    { text: '债权类', value: 'bonds' },
    { text: '宏观对冲类', value: 'macroHedges' },
    { text: '其他', value: 'others' },
    { text: '组合基金-FOF', value: 'fof' },
    { text: '组合基金-MOM', value: 'mom' },
    { text: '（任意策略）', value: 'notnull' },
    { text: '（无策略）', value: 'null' }
  ],
  sourceType: {
    'userUpload': '用户上传',
    'hostMail': '托管邮箱',
    'adminUpload': '管理员上传'
  },
  sourceTypeFilter: [
    { text: '用户上传', value: 'userUpload' },
    { text: '托管邮箱', value: 'hostMail' },
    { text: '管理员上传', value: 'adminUpload' }
  ],
  statisticMap: {
    'startDate': '开始日期',
    'endDate': '结束日期',
    'lastDate': '最新日期',
    'lastValue': '最新净值',
    'timeParam': '时间参数',
    'profit3M': '近三月收益',
    'profit1Y': '近一年收益',
    'profitCY': '今年收益',
    'maintainDays': '基金持续时间',
    'tradingDays': '交易日',
    'positiveDays': '正收益日',
    'negativeDays': '负收益日',
    'zeroDays': '零收益日',
    'finalProfit': '累计收益率',
    'annualRate': '年化收益率',
    'averageDailyRate': '日均收益率',
    'winRate': '胜率',
    'profitLossRatio': '盈亏比',
    'maxDrawDown': '最大回撤',
    'maxRise': '最大上涨',
    'downsideSTDEV': '下侧波动率',
    'allsideSTDEV': '标准差',
    'sharpRate': '夏普比率'
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
