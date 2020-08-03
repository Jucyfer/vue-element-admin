<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="keyword" placeholder="Title" style="width: 200px;" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="initList">
        刷新列表
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list.filter(data => !keyword || data.companyFullName_CH.toLowerCase().includes(keyword.toLowerCase()))"
      border
      fit
      highlight-current-row
      style="width: 100%;height:100%"
      :max-height="computedHeight"
    >
      <el-table-column
        type="index"
        width="50px"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column label="基金管理人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.companyFullName_CH }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成立日期" width="106px" align="center" sortable prop="foundDate">
        <template slot-scope="{row}">
          <span>{{ row.foundDate | valueValidator | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="基金策略"
        width="183px"
        align="center"
        :filters="$store.getters.strategyTableFilter"
        :filter-method="strategyFilterHandler"
      >
        <template slot-scope="{row}">
          <div v-if="!row.strategy.length">--</div>
          <div :key="Math.random()" v-else>
            <el-tag v-for="item in row.strategy" :key="item + Math.random()">{{ item | strategyFilter }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="经营地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.officeAddr | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投顾资质" width="106px" align="center" sortable prop="isQualifiedAdverseThirdParty">
        <template slot-scope="{row}">
          <span>{{ row.isQualifiedAdverseThirdParty | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理规模（万元）" align="center" sortable prop="managementScale">
        <template slot-scope="{row}">
          <span>{{ (row.managementScale * 10000) | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协会管理规模（万元）" align="center" sortable prop="amacFundScale">
        <template slot-scope="{row}">
          <span>{{ row.amacFundScale | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对接人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.agent | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <router-link :to="'/orgList/detail/'+row.registrationSerial">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              查看
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import store from '@/store/index'
export default {
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
  data() {
    return {
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
      tableKey: 0,
      list: [],
      listLoading: false,
        keyword:''
    }
  },
  computed: {
    computedHeight() {
      const privateHeight = window.document.documentElement.clientHeight || window.document.body.clientHeight
      return privateHeight - 190
    }
  },
  created() {
    this.initList()
  },
  methods: {
    async initList() {
      this.listLoading = true
      const { data } = await this.$axios.get('/secure/infomation/managers?userid=' + this.$store.getters.userid)
      this.list = data
      this.listLoading = false
    },
    strategyFilterHandler(value, row, column) {
      // return row.strategy.indexOf(value) >= 0
      switch (value) {
        case 'notnull':
          return row.strategy.length > 0
        case 'null':
          return row.strategy.length === 0
      }
      // row.strategy.some(e => {
      //
      // })
      return row.strategy.indexOf(value) >= 0
    },
    handleExamine(row) {
      return
    }
  }

}
</script>

<style scoped>

</style>
