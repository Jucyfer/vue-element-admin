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
    <!--highlight-current-row-->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :max-height="computedHeight"
      style="width: 100%;height:100%"
    >
      <el-table-column
        type="index"
        width="50px"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column label="基金名称" width="144px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fundName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备案编码" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fundNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成立日期" width="88px" align="center">
        <template slot-scope="{row}">
          <span>{{ new Date(parseFloat(row.establishDate)).toLocaleDateString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="托管人名称" width="117px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mandatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行情况" width="85px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.workingState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基金类型" width="106px" align="center">
        <template slot-scope="{row}">
          <span>暂未获取</span>
        </template>
      </el-table-column>
      <el-table-column :key="Math.random()" label="基金策略" align="center">
        <template slot-scope="{row}">
          <div v-if="!row.isEditMode" :key="Math.random()">
            <el-tag v-for="item in row.strategy" :key="item + Math.random()">{{ item | strategyFilter }}</el-tag>
          </div>
          <el-cascader
            v-if="row.isEditMode"
            v-model="row.strategy"
            :options="cascadeOptions"
            :props="{multiple:true,emitPath:false}"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <div>
            预警线<br>(0-100)
          </div>
        </template>
        <template slot-scope="{row}">
          <span v-if="!row.isEditMode" :key="Math.random()">{{ row.warnLevel | valueValidator }}</span>
          <el-input-number
            v-if="row.isEditMode"
            v-model="row.warnLevel"
            width="50px"
            :controls="false"
            :precision="2"
            :min="0"
            :max="100"
            :step="10"
            placeholder="0~100"
          />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <div>
            强平线<br>(0-100)
          </div>
        </template>
        <template slot-scope="{row}">
          <span v-if="!row.isEditMode" :key="Math.random()">{{ row.closeOut | valueValidator }}</span>
          <el-input-number
            v-if="row.isEditMode"
            v-model="row.closeOut"
            width="50px"
            :controls="false"
            :precision="2"
            :min="0"
            :max="100"
            :step="10"
            placeholder="0~100"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否为代表产品" width="80px" align="center">
        <template slot-scope="{row}">
          <span v-if="!row.isEditMode" :key="Math.random()">{{ row.isRepresent?'是':'否' }}</span>
          <el-checkbox v-if="row.isEditMode" :key="Math.random()" v-model="row.isRepresent">{{ row.isRepresent?'是':'否' }}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" :type="row.isEditMode?'success':'warn'" @click="handleEdit(row)">
            {{ row.isEditMode?'保存':'修改' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'FundList',
  filters: {
    dateFilter(param) {
      const date = new Date(parseFloat(param))
      const yyyy = date.getFullYear()
      const MM = date.getMonth() + 1
      const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return yyyy + '-' + MM + '-' + dd
    },
    strategyFilter(param) {
      return store.getters.strategyMap[param]
    },
    valueValidator(param) {
      // eslint-disable-next-line eqeqeq
      return param == null || param == 0 ? '--' : param
    }
  },
  props: {
    overridePid: String
  },
  data() {
    return {
      list: [],
      listLoading: false,
      cascadeOptions: [],
      strategyMap: {},
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
  computed: {
    computedHeight() {
      const privateHeight = window.document.documentElement.clientHeight || window.document.body.clientHeight
      return privateHeight - 190
    },
    currentPid() {
      return this.overridePid || this.$store.getters.comId
    }
  },
  created() {
    this.initList()
    this.initStore()
  },
  methods: {
    initStore() {
      this.cascadeOptions = this.$store.getters.strategyCascade
    },
    async initList() {
      this.list = []
      this.listLoading = true
      const { data: result } = await this.$axios.get('/secure/infomation/' + this.currentPid + '/fundList?userid=' + this.$store.getters.userid)
      this.list = result
      let i = 1
      this.list.forEach(e => {
        e.id = i++
        e.isEditMode = false
      })
      this.listLoading = false
    },
    async handleEdit(row) {
      row.isEditMode = !row.isEditMode
      if (!row.isEditMode) {
        // /infomation/{pid}/fund/{fundId}/info
        if (row.closeOut == null) {
          row.closeOut = 0.0
        }
        if (row.warnLevel == null) {
          row.warnLevel = 0.0
        }
        const { data: result } = await this.$axios.post(
          '/secure/infomation/' + this.$store.getters.comId + '/fund/' + row.fundId + '/info?userid=' + this.$store.getters.userid,
          { strategy: row.strategy, warnLevel: parseFloat(row.warnLevel), closeOut: parseFloat(row.closeOut), isRepresent: row.isRepresent }
        )
        if (!result) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      }
      this.$forceUpdate()
    }
  }

}
</script>

<style scoped>
  .el-input-number {
    width: 100%
  }
</style>
