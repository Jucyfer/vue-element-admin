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
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleShowCreateDialog">
        新增
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
          <span>{{ row.establishDate }}</span>
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
          <el-button size="mini" type="danger" @click="deleteCustomFund(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      title="添加自定义基金产品"
      :visible.sync="createDialogVisible"
      width="80%"
      top="5vh"
      class="statisticDialog"
      @close="handleClearCreate"
    >
      <el-form
        ref="createForm"
        :model="createForm"
      >
        <el-form-item label="自定义基金名称">
          <el-input v-model="createForm.fundName" placeholder="自定义基金名称" />
        </el-form-item>
        <el-form-item label="基金编号">
          <el-input v-model="createForm.fundNo" placeholder="基金编号" />
        </el-form-item>
        <el-form-item label="托管人名称">
          <el-input v-model="createForm.mandatorName" placeholder="托管人名称" />
        </el-form-item>
        <el-form-item label="运行情况">
          <!--          <el-input v-model="createForm.workingState" placeholder="请输入运行情况" />-->
          <el-radio-group v-model="createForm.workingState">
            <el-radio-button label="正在运作"></el-radio-button>
            <el-radio-button label="延期清算"></el-radio-button>
            <el-radio-button label="提前清算"></el-radio-button>
            <el-radio-button label="正常清算"></el-radio-button>
            <el-radio-button label="非正常清算"></el-radio-button>
            <el-radio-button label="已终止"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="基金成立时间">
          <!--          <el-input v-model="createForm.establishDate" placeholder="请输入基金成立时间" />-->
          <el-date-picker
            v-model="createForm.establishDate"
            type="date"
            placeholder="成立时间"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="基金类型">
          <!--          <el-input v-model="createForm.fundType" placeholder="请输入基金类型" />-->
          <el-radio-group v-model="createForm.fundType">
            <el-radio-button label="权益类"></el-radio-button>
            <el-radio-button label="固定收益类"></el-radio-button>
            <el-radio-button label="商品及金融衍生"></el-radio-button>
            <el-radio-button label="混合类"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="基金策略">
          <!--          <el-input v-model="createForm.strategy" placeholder="请输入基金策略" />-->
          <el-cascader
            v-model="createForm.strategy"
            :options="cascadeOptions"
            :props="{multiple:true,emitPath:false}"
            clearable
          />
        </el-form-item>
        <el-form-item label="预警线（0-100%）">
          <el-input-number v-model.number="createForm.warnLevel" placeholder="请输入预警线" :controls="false" min="0" max="100" />
        </el-form-item>
        <el-form-item label="强平线（0-100%）">
          <el-input-number v-model.number="createForm.closeOut" placeholder="请输入强平线" :controls="false" min="0" max="100" />
        </el-form-item>
        <el-form-item label="是否为代表产品">
          <!--          <el-input v-model="createForm.isRepresent" placeholder="请输入自定义基金名称" />-->
          <el-checkbox v-model="createForm.isRepresent" border>{{ createForm.isRepresent?'是':'否' }}</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClearCreate">
          取消
        </el-button>
        <el-button type="primary" @click="handleCreateCustomFund">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
import store from '@/store/index'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'CustomizedProductInfoList',
  directive: {
    waves
  },
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
      tableKey: 0,
      createDialogVisible: false,
      createForm: {
        fundName: '',
        fundNo: '',
        mandatorName: '',
        workingState: '',
        establishDate: '',
        fundType: '',
        strategy: [],
        warnLevel: 0,
        closeOut: 0,
        isRepresent: false
      }
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
      const { data: result } = await this.$axios.get('/secure/custom/product/' + this.$store.getters.userid + '/list/info')
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
          '/secure/custom/product/' + this.$store.getters.userid + '/' + row.fundNo + '/alter',
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
    },
    async deleteCustomFund(row) {
      const { data } = await this.$axios.delete('/secure/custom/fund/delete/' + row.fundNo)
      this.$message.success('删除成功；来自网页的消息：' + JSON.stringify(data))
      this.initList()
    },
    // 显示对话框
    handleShowCreateDialog() {
      this.createDialogVisible = true
    },
    // 对话框点击取消
    handleClearCreate() {
      this.createForm = {
        fundName: '',
        fundNo: '',
        mandatorName: '',
        workingState: '',
        establishDate: '',
        fundType: '',
        strategy: [],
        warnLevel: 0,
        closeOut: 0,
        isRepresent: false
      }
      this.createDialogVisible = false
    },
    // 对话框点击确定
    async handleCreateCustomFund() {
      console.log(this.createForm)
      const { data: result } = await this.$axios.post('/secure/custom/product/' + this.$store.getters.userid + '/' + this.createForm.fundNo + '/append', this.createForm)
      if (result === 'success') {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.handleClearCreate()
        this.initList()
      } else {
        this.$message({
          message: '提交失败',
          type: 'error'
        })
      }
    }
  }

}
</script>

<style scoped>
  .el-input-number {
    width: 100%
  }
  .statisticDialog {
    align-items: center;
    align-content: center;
    child-align: middle;
  }
</style>
