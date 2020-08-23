<template>
  <div>
    <el-row gutter="20" :class="['el-row-wrap']" :style="{'height':computedHeight+'px'}">
      <el-col span="24">
        <!--        <el-label size="main-title" color="placeholder-text" shadow="1">图表占位符</el-label>-->
        <multi-line-chart
          v-loading="chartLoading"
          height="100%"
          :source="chart.source"
          :series="chart.series"
        ></multi-line-chart>
      </el-col>
    </el-row>
    <el-row gutter="20" :class="['el-row-wrap']" :style="{'height':computedHeight+'px'}">
      <el-col span="8">
        <!--        <el-label size="main-title" color="placeholder-text" shadow="1">左穿梭列表占位符</el-label>-->
        <el-row gutter="20" :class="['el-row-wrap']">
          <el-col span="12">
            <el-date-picker
              v-model="dateSelected"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-col>
          <el-col span="12">
<!--            <el-tooltip content="新增基金" placement="top" effect="light">-->
<!--              <el-button size="medium" class="el-icon-circle-plus-outline" circle></el-button>-->
<!--            </el-tooltip>-->
            <el-tooltip content="测试组合" placement="top" effect="light">
              <el-button size="medium" class="el-icon-video-play" circle @click="testConstruction"></el-button>
            </el-tooltip>
            <el-tooltip content="保存配置" placement="top" effect="light">
              <el-button size="medium" class="el-icon-upload" circle @click="saveCombination"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-table
          :key="tableKey"
          ref="leftTable"
          :data="leftList"
          border
          fit
          highlight-current-row
          :max-height="computedHeight-68"
          empty-text="请从右侧列表选择基金产品"
          show-summary
        >
          <el-table-column
            type="index"
            width="50px"
            label="序号"
            align="center"
          ></el-table-column>
          <el-table-column label="产品名称" align="center">
            <template slot-scope="{row}">
              <el-link :underline="false" @click.prevent="handleExamine(row)"><span>{{ row.fundName }}</span></el-link>
            </template>
          </el-table-column>
          <el-table-column label="规模（万）" align="center" prop="scale">
            <template slot-scope="{row}">
              <el-input-number v-model.number="row.scale" min="0" :controls="false" size="mini"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <!--          弹框净值走势-->
              <el-link type="danger" @click.prevent="handleLeftSelectionDelete(row,$index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col span="16">
        <!--        <el-label size="main-title" color="placeholder-text" shadow="1">右穿梭列表占位符</el-label>-->
        <el-table
          :key="tableKey"
          ref="rightTable"
          v-loading="rightListLoading"
          :data="rightList"
          border
          fit
          highlight-current-row
          :max-height="computedHeight-10"
          @selection-change="handleRightSelectionChange"
        >
          <el-table-column
            type="selection"
            width="50px"
          >
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="{row}">
              <el-label size="body" color="info">产品名称</el-label>
              <el-input
                v-model="productKeyword"
                size="mini"
                placeholder="搜索产品"
              />
            </template>
            <template slot-scope="{row}">
              <el-link :underline="false" @click.prevent="handleExamine(row)"><span>{{ row.fundName }}</span></el-link>
            </template>
          </el-table-column>
          <el-table-column label="管理人名称" align="center" sortable prop="orgName">
            <template slot-scope="{row}">
              <span>{{ row.orgName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="基金策略"
            align="center"
            min-width="173px"
            :filters="$store.getters.strategyTableFilter"
            :filter-method="strategyFilterHandler"
          >
            <template slot-scope="{row}">
              <div v-if="!row.strategy || !row.strategy.length">--</div>
              <div v-else :key="Math.random()">
                <el-tag v-for="item in row.strategy" :key="item + Math.random()">{{ item | strategyFilter }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="最新净值" align="center" sortable prop="lastValue">
            <template slot-scope="{row}">
              <span>{{ row.lastValue | valueValidator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="本周收益" align="center" sortable :sort-method="sortWeekly" prop="profitPresentWeek">
            <template slot-scope="{row}">
              <span>{{ row.profitPresentWeek | valueValidator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="本月收益" align="center" sortable :sort-method="sortMonthly" prop="profitPresentMonth">
            <template slot-scope="{row}">
              <span>{{ row.profitPresentMonth | valueValidator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年化收益率" align="center" sortable :sort-method="sortAnnual" prop="annualRate">
            <template slot-scope="{row}">
              <span>{{ row.annualRate | valueValidator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最大回撤" align="center" sortable :sort-method="sortMaxDrawdown" prop="maxDrawDown">
            <template slot-scope="{row}">
              <span>{{ row.maxDrawDown | valueValidator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收益风险比" align="center" sortable prop="riskReturnRatio">
            <template slot-scope="{row}">
              <span>{{ row.riskReturnRatio | valueValidator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="夏普比率" align="center" sortable prop="sharpRate">
            <template slot-scope="{row}">
              <span>{{ row.sharpRate | valueValidator }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          :key="Math.random()"
          :close-on-click-modal="false"
          :title="currentName"
          :visible.sync="retDialogVisible"
          width="80%"
          class="statisticDialog"
          @close="handleClearChart"
        >
          <el-row gutter="20" class="container-row">
            <simplechart
              :key="Math.random()"
              width="100%"
              height="500px"
              :category.sync="currentCategory"
              :data.sync="currentData"
              :serie-name.sync="data"
              title="走势图"
            />
          </el-row>
          <el-row gutter="20" class="container-row">
            <span>数据概览</span>
          </el-row>
          <fund-summary :key="Math.random()" width="100%" :fund-data="currentRow"></fund-summary>
          <el-row gutter="20" class="container-row">
            <span>净值明细</span>
          </el-row>
          <el-row gutter="20" class="container-row">
            <el-table
              :data="currentDisplay"
              border
              fit
              max-height="600px"
            >
              <el-table-column label="日期" align="center" sortable prop="date">
                <template slot-scope="{row}">
                  <span>{{ row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column label="净值" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.value }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import elLabel from '@/components/elementx/simple/label/el-label'
import MultiLineChart from '@/components/Charts/MultipleDataLineChart'
import simplechart from '@/components/Charts/SingleDataLineChart'
import fundSummary from '@/components/Panel/FundSummary'
import store from '@/store/index'
import elLabel from '@/components/elementx/simple/label/el-label'

export default {
  name: 'FundConstruction',
  filters: {
    valueValidator(param) {
      return param == null || param == 0 ? '--' : param
    },
    strategyFilter(param) {
      return store.getters.strategyMap[param]
    },
    dateFilter(param) {
      if (param === '--') {
        return param
      }
      const date = new Date(parseFloat(param))
      const mm = date.getMonth() + 1
      const m = mm < 10 ? '0' + mm : mm
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return date.getFullYear() + '-' + m + '-' + d
    }
  },
  components: {
    // elLabel,
    simplechart,
    fundSummary,
    MultiLineChart,
    elLabel
  },
  data() {
    return {
      currentCategory: [],
      currentData: [],
      currentRow: {},
      currentName: '',
      currentDisplay: [],
      rightList: [],
      productKeyword: '',
      rightListLoading: false,
      retDialogVisible: false,
      retContainer: {},
      tableKey: 0,
      leftList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近两年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 730)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1095)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dateSelected: [],
      dateStart: '',
      dateEnd: '',
      chartLoading: false,
      chart: {
        source: {},
        series: []
      },
      pathCombineName: this.$route.params && this.$route.params.combineName,
      currentCombineMeta: this.$route.params.currentCombineMeta,
      tempRoute: {}
    }
  },
  computed: {
    computedHeight() {
      const privateHeight = window.document.documentElement.clientHeight || window.document.body.clientHeight
      return (privateHeight - 84) / 2
    }
  },
  watch: {
    dateSelected(newValue, oldValue) {
      // eslint-disable-next-line eqeqeq
      if (newValue && newValue != oldValue && (newValue[0] != this.dateStart || newValue[1] != this.dateEnd)) {
        const realStartDateArr = [...this.leftList.map(fund => fund.category[0]), newValue[0]].sort()
        const realEndDateArr = [...this.leftList.map(fund => fund.category[fund.category.length - 1]), newValue[1]].sort()
        this.dateStart = realStartDateArr.pop()
        this.dateEnd = realEndDateArr.shift()
        this.dateSelected = [this.dateStart, this.dateEnd]
      }
    }
  },
  created() {
    this.tempRoute = Object.assign({}, this.$route)
    this.setTagsViewTitle()
  },
  async mounted() {
    // 先初始化列表，再拿到子基金列表进行渲染
    // 通过$route.params拿到当前母基金信息
    await this.initList()
    console.log('this.currentCombineMeta', this.currentCombineMeta)
    const { data: subResp } = await this.$axios.get('/secure/fundcombine/' + this.currentCombineMeta.creatorId + '/' + this.currentCombineMeta.fundName + '/subfunds')
    console.log('subResp', subResp)
    const subFundMap = subResp.reduce((acc, cur) => {
      acc[cur.fundNo] = cur.scale
      return acc
    }, {})
    console.log('subFundMap', subFundMap)
    console.log(this.$refs.rightTable, this.$refs.rightTable.data, this.$refs.rightTable.data.length)
    this.$refs.rightTable.data.forEach(e => {
      console.log(e.fundNo, e.fundName)
      console.log('test e.fundNo in subFundMap: ', subFundMap[e.fundNo])
      if (subFundMap[e.fundNo] != null) {
        console.log('matched!')
        e.scale = subFundMap[e.fundNo]
        try {
          this.$refs.rightTable.toggleRowSelection(e, true)
        } catch (e) {
          console.log('error!', e)
        }
      }
    })
  },
  methods: {
    async initList() {
      this.rightList = []
      this.rightListLoading = true
      const { data: result } = await this.$axios.get('/secure/infomation/fundOverview?userid=' + this.$store.getters.userid)
      this.rightList = result
      let i = 1
      this.rightList.forEach(e => {
        e.id = i++
      })
      this.rightListLoading = false
    },
    handleExamine(row) {
      this.retDialogVisible = true
      this.currentRow = row
      this.currentDisplay = row.display
      this.currentCategory = row.category
      this.currentData = row.ret
      this.currentName = row.fundName
      this.$forceUpdate()
    },
    handleClearChart() {
      this.currentRow = {}
      this.currentDisplay = []
      this.currentCategory = []
      this.currentData = []
      this.currentName = ''
      this.$forceUpdate()
    },
    strategyFilterHandler(value, row, column) {
      switch (value) {
        case 'notnull':
          return row.strategy && row.strategy.length > 0
        case 'null':
          return row.strategy == null || row.strategy.length === 0
        default:
          return row.strategy && row.strategy.indexOf(value) >= 0
      }
    },
    sortWeekly(a, b) {
      return parseFloat(a.profitPresentWeek) - parseFloat(b.profitPresentWeek)
    },
    sortMonthly(a, b) {
      return parseFloat(a.profitPresentMonth) - parseFloat(b.profitPresentMonth)
    },
    sortAnnual(a, b) {
      return parseFloat(a.annualRate) - parseFloat(b.annualRate)
    },
    sortMaxDrawdown(a, b) {
      return parseFloat(a.maxDrawDown) - parseFloat(b.maxDrawDown)
    },
    // 右侧列表对于元素的更改的处理函数
    handleRightSelectionChange(rightList) {
      this.leftList = rightList
    },
    handleLeftSelectionDelete(row, index) {
      console.log(row.scale)
      this.leftList.splice(index, 1)
      this.$refs.rightTable.toggleRowSelection(row, false)
    },
    // 这个是测试基金组合，查看组合走势的方法
    testConstruction() {
      this.validateConstruction()
        .then(async() => {
          this.chartLoading = true
          const requestObj = {
            startDate: this.dateStart,
            endDate: this.dateEnd,
            profileName: this.$store.getters.userid + '_' + 'default',
            transform: 7,
            selectedList: []
          }
          this.leftList.forEach(e => {
            requestObj.selectedList.push({
              fundId: e.fundNo,
              fundWeight: e.scale
            })
          })
          console.log('requestObj', requestObj)
          const { data: resp } = await this.$axios.post('/secure/custom/fund/combine', requestObj)
          console.log('resp', resp)
          this.chart.source = resp.source
          this.chart.series = []
          const seriesTemplate = {
            connectNulls: true,
            type: 'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average'
          }
          const tempSeries = []
          for (let i = 1; i < resp.order.length; i++) {
            tempSeries.push({
              ...seriesTemplate,
              encode: {
                seriesName: i,
                x: 0,
                y: i
              }
            })
          }
          // console.log('tempSeries', tempSeries)
          this.chart.series = tempSeries
          console.log('this.chart.series', this.chart.series)
          this.$forceUpdate()
          this.$nextTick(() => {
            this.chartLoading = false
          })
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    validateConstruction() {
      const promise = new Promise((resolve, reject) => {
        if (!this.dateSelected || this.dateSelected.length !== 2) {
          reject('请正确选择日期')
        }
        if (this.leftList.length === 0) {
          reject('请从右下侧列表勾选基金！')
        }
        if (this.dateStart >= this.dateEnd) {
          reject('抱歉，日期有误，当前的基金组合没有日期交集！')
        }
        for (const e of this.leftList) {
          // eslint-disable-next-line eqeqeq
          if (!e.scale || e.scale == 0) {
            reject('请正确设置【' + e.fundName + '】的规模数额！')
            break
          }
        }
        resolve(true)
      })
      return promise
    },
    async saveCombination() {
      const body = []
      this.leftList.forEach(fund => {
        body.push({
          fundNo: fund.fundNo,
          scale: fund.scale
        })
      })
      const { data: resp } = await this.$axios.post('/secure/fundcombine/' + this.$store.getters.userid + '/' + this.pathCombineName + '/subfunds', body)
      if (resp === 'success') {
        this.$message.success('操作成功！')
      } else {
        this.$message.error('操作失败！')
      }
    },
    // 路由设置相关
    setTagsViewTitle() {
      const title = '组合基金配置'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.pathCombineName}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    }
  }

}
</script>

<style lang="scss" scoped>
  /deep/.el-date-editor--daterange{
    width:auto;
  }
  .el-row-wrap {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    border-bottom-width: 2px;
    border-bottom-color: #3b91b6;
    border-bottom-style: dashed;

    &:last-child {
      border-bottom: none;
    }
  }

  .el-col {
    text-align: center;
    height: 100%;
    border-right-style: dashed;
    border-right-color: #3b91b6;
    border-right-width: 2px;

    &:last-child {
      border-right: none;
    }
  }

  ul {
    margin: 0;
    padding-left: 0;
  }
</style>
