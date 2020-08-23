<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-input-->
      <!--        v-model="productKeyword"-->
      <!--        placeholder="Title"-->
      <!--        style="width: 200px;"-->
      <!--        class="filter-item"-->
      <!--        @keyup.enter.native="console.log(1234)"-->
      <!--      />-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate()"
      >
        新增
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="initTableList()"
      >
        刷新
      </el-button>
    </div>

    <el-table
      :data="tableList"
      row-key="fundNo"
      border
      lazy
      :load="loadSub"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="组合基金名称" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.fundName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.creatorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品规模（万）" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.scale }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警线" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.warnLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="强平线" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.closeOut }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.fundType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品策略" align="center" prop="temp">
        <template slot-scope="{row}">
          <div v-if="!row.strategy || !row.strategy.length">--</div>
          <div :key="Math.random()" v-else>
            <el-tag v-for="item in row.strategy" :key="item + Math.random()">{{ item | strategyFilter }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="最新拟合累计净值" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.lastValue | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本周收益" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.profitPresentWeek | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本月收益" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.profitPresentMonth | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年化收益率" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.annualRate | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大回撤" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.maxDrawDown | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益风险比" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.riskReturnRatio | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="夏普比率" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.sharpRate | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新净值更新日期" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.lastDate | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持续天数" align="center" prop="temp">
        <template slot-scope="{row}">
          <span>{{ row.maintainDays | valueValidator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--          编辑基金信息-->
          <el-button v-if="row.hasChildren && row.creatorId === $store.getters.userid" size="mini" type="success" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button v-if="row.hasChildren && row.creatorId === $store.getters.userid" size="mini" type="success" @click="handleConfig(row)">
            配置
          </el-button>
          <!--          弹框净值走势-->
          <el-button v-if="row.hasChildren" size="mini" type="success" @click="handleExamine(row)">
            查看
          </el-button>
          <!--          刷新母基金各项统计数据-->
          <el-button v-if="row.hasChildren" size="mini" type="success" @click="handleRefresh(row)">
            刷新
          </el-button>
          <!--          弹框净值走势-->
          <el-button v-if="row.hasChildren && row.creatorId === $store.getters.userid" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="组合基金元信息"
      :visible.sync="metaDialogVisible"
      width="80%"
    >
      <el-form
        ref="metaForm"
        :rules="rules"
        label-position="top"
        :model="metaForm"
        style="width: 90%; margin-left:50px;margin-right: 50px"
      >
        <el-form-item
          label="组合基金名称"
        >
          <el-input v-model="metaForm.combineName" :readonly="metaFormState=='edit'"></el-input>
        </el-form-item>
        <el-form-item
          label="预警线"
        >
          <el-input-number v-model.number="metaForm.warn" min="0" max="100" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item
          label="强平线"
        >
          <el-input-number v-model.number="metaForm.closeOut" min="0" max="100" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item
          label="产品规模（万）"
        >
          <el-input-number v-model.number="metaForm.totalScale" min="0" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item
          label="产品类型"
        >
          <el-radio-group v-model="metaForm.productType">
            <el-radio-button label="权益类"></el-radio-button>
            <el-radio-button label="固定收益类"></el-radio-button>
            <el-radio-button label="商品及金融衍生"></el-radio-button>
            <el-radio-button label="混合类"></el-radio-button>
          </el-radio-group>
          <!--          权益类、固定收益类、商品及金融衍生、混合类-->
        </el-form-item>
        <el-form-item
          label="分配比例"
        >
          <el-radio-group v-model="metaForm.proportion">
            <el-radio-button label="自定义"></el-radio-button>
            <el-radio-button disabled label="等权"></el-radio-button>
            <el-radio-button disabled label="风险平价"></el-radio-button>
          </el-radio-group>
          <!--         自定义、等权、风险平价-->
        </el-form-item>
        <el-form-item
          label="备注"
        >
          <el-input v-model="metaForm.notes" type="textarea" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="metaDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
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
    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
import store from '@/store/index'
import simplechart from '@/components/Charts/SingleDataLineChart'
import fundSummary from '@/components/Panel/FundSummary'
export default {
  name: 'FundCombine',
  components: {
    simplechart,
    fundSummary
  },
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
      currentCategory: [],
      currentData: [],
      currentRow: {},
      currentName: '',
      currentDisplay: [],
      retDialogVisible: false,
      retContainer: {},
      tableList: [],
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
      metaDialogVisible: false,
      metaForm: {
        combineName: '',
        warn: 0,
        closeOut: 0,
        productType: '',
        totalScale: 0,
        proportion: '',
        notes: ''
      },
      productKeyword: '',
      metaFormState: ''
    }
  },
  created() {
    this.initTableList()
  },
  methods: {
    async initTableList() {
      const { data: resp } = await this.$axios.get('/secure/fundcombine/list')
      let i = 10
      resp.forEach(e => {
        e.id = i++
        e.hasChildren = true
      })
      this.tableList = resp
    },
    async loadSub(tree, treeNode, resolve) {
      console.log('this.tableList', this.tableList)
      // tree参数是当前行
      console.log('tree', tree)
      const { data: resp } = await this.$axios.get('/secure/fundcombine/' + tree.creatorId + '/' + tree.fundName + '/subfunds')
      resolve(resp)
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
    async handleDelete(row) {
      const { data: resp } = await this.$axios.delete('/secure/fundcombine/' + row.creatorId + '/' + row.fundName)
      if (resp == 'success') {
        this.$message.success('操作成功！')
        this.initTableList()
      } else {
        this.$message.error('操作失败！')
      }
    },
    handleEdit(row) {
      this.metaFormState = 'edit'
      this.metaForm = {
        combineName: row.fundName,
        warn: row.warnLevel,
        closeOut: row.closeOut,
        productType: row.fundType,
        totalScale: row.totalScale,
        proportion: row.proportion,
        notes: row.notes
      }
      this.metaDialogVisible = true
    },
    async handleRefresh(row) {
      // /fundcombine/{userid}/{combineName}/refresh/{combineId}
      const { data } = await this.$axios.get('/secure/fundcombine/' + row.creatorId + '/' + row.fundName + '/refresh/' + row.fundNo)
      if (data) {
        this.$message.success('刷新成功！')
      }
      const {
        lastValue,
        profitPresentWeek,
        profitPresentMonth,
        annualRate,
        maxDrawDown,
        riskReturnRatio,
        sharpRate,
        lastDate,
        maintainDays
      } = data
      row.lastValue = lastValue
      row.profitPresentWeek = profitPresentWeek
      row.profitPresentMonth = profitPresentMonth
      row.annualRate = annualRate
      row.maxDrawDown = maxDrawDown
      row.riskReturnRatio = riskReturnRatio
      row.sharpRate = sharpRate
      row.lastDate = lastDate
      row.maintainDays = maintainDays
      this.initTableList()
    },
    handleConfig(row) {
      this.$router.push({
        name: 'fundconstruct',
        params: {
          combineName: row.fundName,
          currentCombineMeta: row
        }
      })
    },
    handleCreate() {
      this.metaFormState = 'create'
      this.metaForm = {
        combineName: '',
        warn: 0,
        closeOut: 0,
        productType: '',
        totalScale: 0,
        proportion: '',
        notes: ''
      }
      this.metaDialogVisible = true
    },
    async updateData() {
      this.metaForm.creatorUserId = this.$store.getters.userid
      let response
      switch (this.metaFormState) {
        case 'create':
          response = await this.$axios.post('/secure/fundcombine/' + this.metaForm.creatorUserId + '/new', this.metaForm)
          break
        case 'edit':
          response = await this.$axios.post('/secure/fundcombine/' + this.metaForm.creatorUserId + '/' + this.metaForm.combineName + '/update', this.metaForm)
          break
        default:
          break
      }
      const { data } = response
      if (data == 'success') {
        this.$message.success('操作成功！')
        this.metaDialogVisible = false
        this.initTableList()
      } else {
        this.$message.error('操作失败！')
      }
    }
  }

}
</script>

<style scoped>

</style>
