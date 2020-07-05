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
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      :default-sort="{prop: 'lastupdatetime', order: 'descending'}"
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="50px"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column label="管理人" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleApproval(row,false)">{{ row.pname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="填报人" class-name="status-col" min-width="110px">
        <template slot-scope="{row}">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" class-name="status-col" min-width="110px" sortable prop="lastupdatetime">
        <template slot-scope="{row}">
          {{ row.lastupdatetime }}
        </template>
      </el-table-column>
      <el-table-column label="完成度" class-name="status-col" min-width="110px">
        <template slot-scope="{row}">
          {{ row.status }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" min-width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleApproval(row,false)">
            修改
          </el-button>
          <el-button size="mini" type="success" @click="handleApproval(row,true)">
            查看
          </el-button>
          <el-button size="mini" type="danger">
            清空
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--浮出的对话框-->
    <el-dialog
      :title="尽调报告"
      :visible.sync="dialogFormVisible"
      width="80%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="currentQList"
        label-position="top"
        style="width: 90%; margin-left:50px;margin-right: 50px"
      >
        <el-button type="warning" @click="$store.commit('reports/ALTER_VIEW_ONLY', !$store.getters.reportViewOnly)">切换编辑/只读</el-button>
        <el-form-item
          v-for="quest in currentQList"
          v-if="isQuestionVisible(quest)"
          :key="quest.q + Math.random()"
          :label="getCNTag(quest.q)"
        >
          <el-cascader-panel
            v-if="extractMeta(quest.q, 'is')=='cascade'"
            v-model="quest.data"
            :options="cascadeOptions"
            :props="{multiple:true,emitPath:false,expandTrigger:'hover'}"
            @change="listenChange(quest)"
          />
          <component
            :is="extractMeta(quest.q, 'is') | componentFilter"
            v-else
            v-model="quest.data"
            :readonly="$store.getters.reportViewOnly"
            :type="extractMeta(quest.q, 'is') | inpuTypeFilter"
            :column-meta="extractMeta(quest.q, 'dataHead')"
            :options="{hideModeSwitch:true,previewStyle:'tab'}"
            mode="wysiwyg"
            :custom-options="{fixed:extractMeta(quest.q,'fixed'),customContentWrapper:customContentWrapper,globalEditType:extractMeta(quest.q,'editType')}"
            :autosize="extractMeta(quest.q,'is')==='input'"
          >
            <template v-if="$store.getters.reportViewOnly">{{ quest.data }}</template>
          </component>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">
          取消
        </el-button>
        <el-button v-if="!$store.getters.reportViewOnly" type="primary" @click="updateData()">
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
import SingleFile from '@/components/Upload/SingleFile'
import store from '@/store/index'
export default {
  name: 'UsrAllReports',
  // eslint-disable-next-line vue/no-unused-components
  components: { MarkdownEditor, DynamicTable },
  directives: { waves },
  filters: {
    componentFilter(isStr) {
      let realIs = ''
      switch (isStr) {
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
        case 'singleFile':
          realIs = 'single-file'
          break
        case 'input':
        default:
          realIs = store.getters.reportViewOnly ? 'div' : 'el-input'
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
      currentQList: [],
      isEditMode: false,
      currentTicket: '',
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
      selectedCascade: [],
      // end
      tableKey: 0,
      list: [],
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
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
      // downloadLoading: false
    }
  },
  async created() {
    this.$store.dispatch('questCommon/init_quest_CN_Map')
    this.$store.dispatch('questCommon/init_quest_Meta_Map')
    this.getList()
  },
  beforeDestory() {
    this.$store.commit('reports/ALTER_VIEW_ONLY', false)
  },
  methods: {
    isQuestionVisible(question) {
      const q = question.q
      const qis = this.extractMeta(q, 'is')
      const qcondition = this.extractMeta(q, 'conditions')
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
    listenChange(quest) {
      quest.modified = true
      this.selectedCascade = quest.data
    },
    async getList() {
      this.listLoading = true
      const { data: resp } = await this.$axios.get('/secure/approval/indexes?userid=' + this.$store.getters.userid)
      console.log(resp)
      this.list = resp
      this.listLoading = false
    },
    async handleApproval(row, editMode) {
      this.$store.commit('reports/ALTER_VIEW_ONLY', editMode)
      this.currentTicket = row.pid
      const { data: resp } = await this.$axios.get('/secure/approval/overview/' + row.pid + '?userid=' + this.$store.getters.userid)
      console.log('管理员角度获取到的用户answer：')
      console.log(resp)
      for (const q in resp) {
        if (resp[q].q === 'Q26') {
          this.selectedCascade = resp[q].data
          break
        }
      }
      if (!resp) {
        this.$message.error('操作失败！！！！请重新登录！！！')
      } else {
        this.$message.success('操作成功！')
      }
      this.currentQList = resp
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    async updateData(row) {
      console.log(this.currentQList)
      const { data: resp } = await this.$axios.post('/secure/approval/overview/' + this.currentTicket + '?userid=' + this.$store.getters.userid, this.currentQList)
      if (!resp) {
        this.$message.error('保存失败！！！！请重新登录！！！')
      } else {
        this.$message.success('保存成功！')
      }
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     const tempData = Object.assign({}, this.temp)
      //     tempData.timestamp = +new Date(tempData.timestamp)
      //   }
      // })
      this.dialogFormVisible = false
      this.$nextTick(() => {
        this.currentQList = []
      })
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.$nextTick(() => {
        this.currentQList = []
      })
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
  .el-cascader-menu__wrap {
    height: 100%
  }
</style>
