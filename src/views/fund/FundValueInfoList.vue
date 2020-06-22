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
      max-height="800"
      style="width: 100%;height:100%"
    >
      <el-table-column
        type="index"
        width="50px"
        label="序号"
        align="center"
      ></el-table-column>
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
      <el-table-column label="操作" min-width="140px" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="success" @click="handleUploadDialogShow(row)">
            编辑
          </el-button>
          <el-button size="mini" type="success" @click="handleExamine(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :key="Math.random()" title="净值批量上传" :visible.sync="uploadDialogVisible" width="80%" @close="uploaded=false">
      <el-row gutter="20">
        <el-col span="6">
          <div style="line-height: 1.5; font-size: 16px">请选择净值上传方式</div>
        </el-col>
      </el-row>
      <el-row gutter="20">
        <el-col span="24">
          <el-tabs type="border-card">
            <el-tab-pane label="手工上传">
              <div class="content-container">
                <el-row gutter="20">
                  <el-label>绑定托管邮箱前，可以以下载模板手工上传方式批量上传净值</el-label>
                </el-row>
                <el-row gutter="20">
                  <el-link href="/common/upload/templates/净值上传模板（单基金）.xlsx"><el-label color="brand" size="minor-text">净值手工上传模板请点这里</el-label></el-link>
                </el-row>
                <el-row v-loading="uploading" gutter="20">
                  <!--                  /infomation/{pid}/fund/{fundId}/value-->
                  <el-upload
                    :show-file-list="false"
                    :action="'/secure/infomation/'+$store.getters.comId+'/fund/'+currentFundId+'/value?userid='+$store.getters.userid"
                    accept=".xls,.XLS,.xlsx,.XLSX"
                    :on-success="handleUploadFileSuccess"
                    :on-error="handleUploadFailed"
                    :before-upload="beforeUpload"
                    :headers="{token:$store.getters.token}"
                  >
                    <el-button type="primary">上传净值文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
                  </el-upload>
                </el-row>
                <el-row v-show="uploaded && isError" gutter="20">
                  <el-label color="danger">上传失败！！请重试或联系管理员！</el-label>
                </el-row>
                <el-row v-show="uploaded && !isError" gutter="20">
                  <el-label color="success">上传成功！</el-label>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="托管邮箱">
              <div class="content-container">
                <el-row gutter="20">
                  <el-col span="24">
                    <el-label color="danger">为方便后期业绩跟踪，请将下面邮箱地址复制黏贴到产品所在托管，绑定成功前的净值请以模板自行上传或者联系管理员</el-label>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="24">
                    <el-input value="dataori@110972.tech" readonly style="width:400px;max-width:100%;" />
                    <el-button v-clipboard:copy="'dataori@110972.tech'" v-clipboard:success="handleClipSuccess" type="primary" icon="el-icon-document">
                      复制邮箱地址
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
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
      <el-row gutter="20"  class="container-row">
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
      <el-row gutter="20"  class="container-row">
        <span>数据概览</span>
      </el-row>
      <fund-summary :key="Math.random()" width="100%" :fund-data="currentRow"></fund-summary>
      <el-row gutter="20"  class="container-row">
        <span>净值明细</span>
      </el-row>
      <el-row gutter="20"  class="container-row">
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
import elLabel from '@/components/elementx/simple/label/el-label'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  name: 'FundValueInfoList',
  directives: {
    clipboard
  },
  filters: {
    valueValidator(param) {
      return param == null || param == 0 ? '--' : param
    },
    sourceFilter(param) {
      return store.getters.fundValSourceMap[param]
    }
  },
  components: {
    simplechart,
    elLabel,
    fundSummary
  },
  data() {
    return {
      currentCategory: [],
      currentData: [],
      currentRow: {},
      currentName: '',
      currentDisplay: [],
      currentFundId: '',
      list: [],
      listLoading: false,
      uploaded: false,
      uploading: false,
      isError: false,
      retDialogVisible: false,
      uploadDialogVisible: false,
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
    sourceFilterHandler(value, row, column) {
      return row.lastFrom && row.lastFrom.indexOf(value) >= 0
    },
    handleClipSuccess() {
      this.$message({
        message: '已复制到剪贴板',
        type: 'success',
        duration: 1500
      })
    },
    handleUploadDialogShow(row) {
      this.uploadDialogVisible = true
      this.currentFundId = row.fundNo
    },
    handleUploadFileSuccess() {
      this.afterUpload()
      this.isError = false
      this.initList()
      this.$message({
        message: '上传成功！',
        type: 'success',
        duration: 1500
      })
    },
    handleUploadFailed() {
      this.afterUpload()
      this.isError = true
      this.$message.error('上传失败！')
    },
    beforeUpload() {
      this.uploading = true
    },
    afterUpload() {
      this.uploaded = true
      this.uploading = false
    }
  }

}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 14px;
  line-height: 1.5;
  &:last-child {
    margin-bottom: 0;
  }
}
.container-row{
  line-height: 1.5;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
