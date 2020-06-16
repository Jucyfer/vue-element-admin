<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="console.log(1234)" />
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
      <el-table-column label="序号" width="57px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基金名称" min-width="144px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fundName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新净值" align="center" sortable prop="lastValue">
        <template slot-scope="{row}">
          <span>{{ row.lastValue | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="净值更新日期" align="center" sortable prop="lastDate">
        <template slot-scope="{row}">
          <span>{{ row.lastDate | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最后更新渠道"
        align="center"
        sortable
        prop="lastFrom"
        :filters="$store.getters.fundValSourceFilter"
        :filter-method="sourceFilterHandler"
      >
        <template slot-scope="{row}">
          <span>{{ row.lastFrom | valueValidator | sourceFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--          编辑基金信息-->
          <el-button size="mini" type="success" @click="handleExamine(row)">
            编辑
          </el-button>
          <!--          弹框净值走势-->
          <el-button size="mini" type="success" @click="handleExamine(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :key="Math.random()" :title="currentName" :visible.sync="retDialogVisible" @close="handleClearChart" width="80%">
      <simplechart width="100%" height="500px" :key="Math.random()" :category.sync="currentCategory" :data.sync="currentData" serie-name="data" title="走势图" />
    </el-dialog>
    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
import store from '@/store/index'
import simplechart from '@/components/Charts/SingleDataLineChart'
export default {
  name: 'FundValueInfoList',
  filters: {
    valueValidator(param) {
      return param == null || param == 0 ? '--' : param
    },
    sourceFilter(param) {
      return store.getters.fundValSourceMap[param]
    }
  },
  components: {
    simplechart
  },
  data() {
    return {
      currentCategory: [],
      currentData: [],
      currentName: '',
      list: [],
      listLoading: false,
      retDialogVisible: false,
      retContainer: {
      },
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
      const { data: result } = await this.$axios.get('/secure/infomation/' + this.$store.getters.comId + '/fundValueList?userid=' + this.$store.getters.userid)
      this.list = result
      let i = 1
      this.list.forEach(e => {
        e.id = i++
      })
      this.listLoading = false
    },
    handleExamine(row) {
      this.retDialogVisible = true
      this.currentCategory = row.category
      this.currentData = row.ret
      this.currentName = row.fundName
      this.$forceUpdate()
    },
    handleClearChart() {
      this.currentCategory = []
      this.currentData = []
      this.currentName = ''
      this.$forceUpdate()
    },
    sourceFilterHandler(value, row, column) {
      return row.lastFrom && row.lastFrom.indexOf(value) >= 0
    }
  }

}
</script>

<style scoped>

</style>
