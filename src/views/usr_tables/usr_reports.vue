<template>
  <div class="app-container">
    <el-progress class="progress_style" :text-inside="true" :stroke-width="26" :percentage="70" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        width="80"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!--      Title=>标题-->
      <el-table-column label="标题" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <!--          <el-tag>{{ row.type | typeFilter }}</el-tag>-->
        </template>
      </el-table-column>
      <!--      Status=>状态-->
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="291" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            清空
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--浮出的对话框-->
    <el-dialog
      :title="currentStepData['title']"
      :visible.sync="dialogFormVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="currentStepData"
        label-position="top"
        style="width: 90%; margin-left:50px;margin-right: 50px"
      >
        <el-form-item
          v-for="quest in currentStepData.qList"
          v-if="isQuestionVisible(quest)"
          :key="quest.q"
          :label="getCNTag(quest.q)"
        >
          <component
            :is="extractMeta(quest.q, 'is') | componentFilter"
            v-model="quest.data"
            :type="extractMeta(quest.q, 'is') | inpuTypeFilter"
            :column-meta="extractMeta(quest.q, 'dataHead')"
            :options="extractMeta(quest.q, 'is') =='markdown-editor'?{hideModeSwitch:true,previewStyle:'tab'}:cascadeOptions"
            mode="wysiwyg"
            :props="{multiple:true,emitPath:false,expandTrigger:'hover'}"
            :custom-options="{fixed:extractMeta(quest.q,'fixed'),customContentWrapper:customContentWrapper,globalEditType:extractMeta(quest.q,'editType')}"
            :autosize="extractMeta(quest.q,'is')==='input'"
            @change="listenChange(quest.data)"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--        随便加的-->
        <el-button :disabled="currentStep==1" @click="handlePreviousStep">
          上一步
        </el-button>
        <el-button :disabled="currentDataSet.data && currentStep==currentDataSet.data.length" @click="handleNextStep">
          下一步
        </el-button>
        <!--        随便加的（结束）-->
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { fetchList, createArticle, updateArticle } from '@/api/article'
// import { createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import MarkdownEditor from '@/components/MarkdownEditor'
import DynamicTable from '@/views/table/DynamicTable'

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})

export default {
  name: 'UsrAllReportsAdmin',
  // eslint-disable-next-line vue/no-unused-components
  components: { MarkdownEditor, DynamicTable },
  directives: { waves },
  filters: {
    componentFilter(isStr) {
      let realIs = ''
      switch (isStr) {
        case 'input':
          realIs = 'el-input'
          break
        case 'markdown-editor':
          realIs = 'markdown-editor'
          break
        case 'fixed-table':
        case 'dynamic-table':
          realIs = 'dynamic-table'
          break
        case 'cascade':
          realIs = 'el-cascader-panel'
          break
        default:
          realIs = 'el-input'
          break
      }
      return realIs
    },
    inpuTypeFilter(isStr) {
      let rType = ''
      switch (isStr) {
        case 'input':
          rType = 'textarea'
          break
        default:
          break
      }
      return rType
    }
  },
  data() {
    return {
      // 对话框的标记步骤
      // ...mapState(['questMetaMap', 'questMap']),
      currentStep: 1,
      currentStepData: {},
      currentTicket: '',
      // 增加的模板对象
      currentDataSet: {},
      // 关于策略选择的候选项
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
      selectedCascade: [],
      reports: {},
      // end
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      statusOptions: ['待审核', '核准', '核拒'],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  async created() {
    this.getList()
    this.$store.dispatch('questCommon/init_quest_CN_Map')
    this.$store.dispatch('questCommon/init_quest_Meta_Map')
  },
  methods: {
    isQuestionVisible(question) {
      const q = question.q
      const qis = this.extractMeta(question.q, 'is')
      const qcondition = this.extractMeta(question.q, 'conditions')
      if (qis !== 'fixed-table') {
        return true
      } else {
        return qcondition ? (this.selectedCascade.indexOf(qcondition) + 1) : true
      }
    },
    customContentWrapper(data) {
      const wrapMap = this.$store.getters.questMap
      return wrapMap[data] || data
    },
    handlePreviousStep() {
      // eslint-disable-next-line eqeqeq
      if (this.currentStep == 1) {
        return
      } else {
        this.currentStep -= 1
        this.currentStepData = this.getXstep(this.currentStep)
      }
    },
    // todo :这个地方有bug,当重新加载的时候没有双向同步,导致问题表格消失
    listenChange(data) {
      this.selectedCascade = data
      console.log(data)
    },
    async handleNextStep() {
      // eslint-disable-next-line eqeqeq
      if (this.currentStep == this.currentDataSet.data.length) {
        return
      } else {
        const { data: resp } = await this.$axios.post('/secure/invest/parts/' + this.currentTicket + '?userid=' + this.$store.getters.userid, this.currentStepData.qList)
        if (resp !== 'success') {
          this.$message.error('保存失败！！！！请重新登录！！！')
        } else {
          this.$message.success('保存成功！')
        }
        this.currentStep += 1
        this.currentStepData = this.getXstep(this.currentStep)
      }
    },
    getXstep(stepIndex) {
      const dataArr = this.currentDataSet.data
      // eslint-disable-next-line eqeqeq
      return dataArr.filter(step => step.step == stepIndex)[0]
    },
    async getList() {
      this.listLoading = true
      const { data: resp } = await this.$axios.get('/secure/invest/indexes?userid=' + this.$store.getters.userid)
      console.log(resp)
      this.list = resp
      this.listLoading = false
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    async handleUpdate(row) {
      this.currentTicket = row.ticket
      const { data: resp } = await this.$axios.get('/secure/invest/parts/' + row.ticket + '?userid=' + this.$store.getters.userid)
      console.log('用户角度获取到的answer报文：')
      console.log(resp)
      for (const i in resp.data) {
        resp.data[i].qList.forEach(quest => {
          if (quest.q === 'Q26') {
            this.selectedCascade = quest.data
          }
        })
      }
      if (!resp) {
        this.$message.error('操作失败！！！！请重新登录！！！')
      } else {
        this.$message.success('操作成功！')
      }
      this.currentStep = 1
      let flag = false
      switch (row.title) {
        case '公司情况':
          // this.currentDataSet = this.comstandardinfo
          flag = true
          break
        case '投资分析':
          // this.currentDataSet = this.investAnalize
          flag = true
          break
        case '风险控制':
          // this.currentDataSet = this.riskcontrol
          flag = true
          break
        case '业绩、信息披露及所获奖励':
          // this.currentDataSet = this.performanceXreward
          flag = true
          break
        case '资料清单':
          break
        default:
          break
      }
      if (!flag) {
        return
      }
      this.currentDataSet = resp
      this.currentStepData = this.getXstep(this.currentStep)
      this.dialogFormVisible = true
    },
    async updateData(row) {
      const { data: resp } = await this.$axios.post('/secure/invest/parts/' + this.currentTicket + '?userid=' + this.$store.getters.userid, this.currentStepData.qList)
      if (!resp) {
        this.$message.error('保存失败！！！！请重新登录！！！')
      } else {
        this.$message.success('保存成功！')
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }
      })
      this.dialogFormVisible = false
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      // this.list.splice(index, 1)
    },
    // handleFetchPv(pv) {
    //   fetchPv(pv).then(response => {
    //     this.pvData = response.data.pvData
    //     this.dialogPvVisible = true
    //   })
    // },
    debugData(data) {
      console.log(this.markdownContent)
    },
    extractMeta(qid, index) {
      return this.$store.getters.questMetaMap[qid][index]
    },
    getCNTag(qid) {
      return this.$store.getters.questMap[qid] || qid
    }
  }
}
</script>

<style scoped>
  .progress_style::before {
    content: "填写进度：";
    display: inline-block;
    padding-bottom: 10px;
  }

  .progress_style {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .el-cascader-menu__wrap {
    height: 100%
  }
</style>
