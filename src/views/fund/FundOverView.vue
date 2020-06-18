<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Title"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="console.log(1234)"
      />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="console.log(1234)">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="console.log(1234)">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="initList">
        刷新列表
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;height:100%"
    >
      <el-table-column label="序号" width="63px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基金产品" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fundName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备案编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理人名称" align="center" sortable prop="orgName">
        <template slot-scope="{row}">
          <span>{{ row.orgName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行情况" align="center">
        <template slot-scope="{row}">
          <span>{{ row.workingState | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="基金策略"
        align="center"
        :filters="$store.getters.strategyTableFilter"
        :filter-method="strategyFilterHandler"
      >
        <template slot-scope="{row}">
          <div :key="Math.random()">
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
      <el-table-column label="风险收益比" align="center" sortable prop="riskReturnRatio">
        <template slot-scope="{row}">
          <span>{{ row.riskReturnRatio | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="夏普比率" align="center" sortable prop="sharpRate">
        <template slot-scope="{row}">
          <span>{{ row.sharpRate | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净值更新日期" align="center" sortable prop="lastDate">
        <template slot-scope="{row}">
          <span>{{ row.lastDate | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持续天数" align="center" sortable prop="maintainDays">
        <template slot-scope="{row}">
          <span>{{ row.maintainDays | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--          弹框净值走势-->
          <el-button size="mini" type="success" @click="handleExamine(row)">
            查看
          </el-button>
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
      <simplechart
        :key="Math.random()"
        width="100%"
        height="500px"
        :category.sync="currentCategory"
        :data.sync="currentData"
        :serie-name.sync="data"
        title="走势图"
      />
      <div>
        <span>数据概览</span>
      </div>
      <fund-summary :key="Math.random()" width="100%" :fund-data="currentRow"></fund-summary>
      <div>
        <span>净值明细</span>
      </div>
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
    </el-dialog>
    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
import store from '@/store/index'
import simplechart from '@/components/Charts/SingleDataLineChart'
import fundSummary from '@/components/Panel/FundSummary'

export default {
  name: 'FundOverView',
  filters: {
    valueValidator(param) {
      return param == null || param == 0 ? '--' : param
    },
    strategyFilter(param) {
      return store.getters.strategyMap[param]
    }
  },
  components: {
    simplechart,
    fundSummary
  },
  data() {
    return {
      currentCategory: [],
      currentData: [],
      currentRow: {},
      currentName: '',
      currentDisplay: [],
      list: [],
      listLoading: false,
      retDialogVisible: false,
      retContainer: {},
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      tableKey: 0
    }
  },
  created() {
    this.initList()
  },
  methods: {
    async initList() {
      this.list = []
      this.listLoading = true
      const { data: result } = await this.$axios.get('/secure/infomation/fundOverview?userid=' + this.$store.getters.userid)
      this.list = result
      let i = 1
      this.list.forEach(e => {
        e.id = i++
      })
      this.listLoading = false
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
      return row.strategy.indexOf(value) >= 0
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
    }
  }

}
</script>

<style scoped>
  .statisticDialog {
    align-items: center;
    align-content: center;
    child-align: middle;
  }
</style>
