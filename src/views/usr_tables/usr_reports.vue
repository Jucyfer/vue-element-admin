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
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
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
    <el-dialog :title="currentStepData['title']" :visible.sync="dialogFormVisible" width="80%" :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="currentStepData"
        label-position="top"
        style="width: 90%; margin-left:50px;margin-right: 50px"
      >
        <el-form-item v-for="quest in currentStepData.qList" :key="quest.q" :label="quest.q | questFilter" :prop="quest.tg">
          <component :is="quest.is | componentFilter" v-model="quest.data" :type="quest.is | inpuTypeFilter" :column-meta="quest.dataHead" :options="{hideModeSwitch:true,previewStyle:'tab'}" mode="wysiwyg" :custom-options="{fixed:quest.fixed,customContentWrapper:customContentWrapper.bind(this)}" />
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

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})
const qMap = {
  'Q1': '公司简介（公司历史沿革、业务概况、经营理念等）',
  'Q2': '公司每年向基金业协会报送经会计师事务所审计的年度财务报告和所管理私募基金年度投资运作基本情况',
  'Q3': '公司的组织架构图',
  'Q4': '公司的组织架构（各部门职能及负责人信息）',
  'Q5': '公司股权结构',
  'Q6': '公司的专业团队规模',
  'Q7': '关键岗位人才人员介绍(例如投资总监、基金经理、研究总监、量化总监、风控总监、市场总监等，以各公司的实际情况为准)的姓名、职位职务、进入本公司的时间、教育背景、之前的工作履历、投资历史及主要业绩(例如曾管理的产品数目、资产规模、所管理的各支产品的业绩情况等信息)',
  'Q8': '团队稳定性',
  'Q9': '介绍公司对员工的考核标准、收入结构以及激励机制',
  'Q10': '公司的运营风险管理框架，以及如何识别、评估、监控和控制运营风险',
  'Q11': '公司的内部合规管理方法',
  'Q12': '公司是否拥有自行研发或者使用标准化IT产品？',
  'Q13': 'IT系统服务器的托管方式(是托管在自有机房还是托管机房)，IT系统采用的编程语言，以及敏感数据和关键系统的保存与灾备机制(如何应对电源、电脑软、硬件系统崩溃或网络通讯中断等突发事件)',
  'Q14': '公司储存数据的方式、数据库架构以及数据的来源',
  'Q15': '请说明公司整体的优势和劣势是什么，以及维持优势的关键因素。',
  'Q16': '公司长期合作的外部服务商情况',
  'Q17': '与知名金融机构合作产品规模、成立时间等',
  'Q18': '公司内部的投资风险管理方法',
  'Q19': '公司投资风险控制方法的主要特点',
  'Q20': '公司如何控制产品的下行风险'
}

export default {
  name: 'UsrAllReportsAdmin',
  // eslint-disable-next-line vue/no-unused-components
  components: { MarkdownEditor, DynamicTable },
  directives: { waves },
  filters: {
    questFilter(questId) {
      return qMap[questId]
    },
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
      currentStep: 1,
      currentStepData: {},
      // 增加的模板对象
      currentDataSet: {},
      comstandardinfo: {
        'ticket': 'FA02-C032-26372-04D1A',
        'size': 6,
        'data': [{
          'step': 1,
          'title': '公司情况及基本资料',
          'qList': [{
            'q': 'Q1',
            'tg': 'orgdescription',
            'is': 'input',
            'data': ''
          }, {
            'q': 'Q2',
            'tg': 'orgfinancialstatus',
            'is': 'input',
            'data': ''
          }, {
            'q': 'Q3',
            'tg': 'organizestructimage',
            'is': 'markdown-editor',
            'data': ''
          }, {
            'q': 'Q4',
            'tg': 'organizestruct',
            'is': 'dynamic-table',
            'data': [{
              'depart': '',
              'head': '',
              'count': '',
              'function': ''
            }, {
              'depart': '',
              'head': '',
              'count': '',
              'function': ''
            }, {
              'depart': '',
              'head': '',
              'count': '',
              'function': ''
            }],
            'dataHead': [{
              'name': 'depart',
              'label': '部门名称'
            }, {
              'name': 'head',
              'label': '负责人'
            }, {
              'name': 'count',
              'label': '员工人数'
            }, {
              'name': 'function',
              'label': '职能'
            }]
          }, {
            'q': 'Q5',
            'tg': 'equitystructure',
            'is': 'dynamic-table',
            'data': [{
              'name': '',
              'amt': 100,
              'percent': 100.0
            }, {
              'name': '',
              'amt': 100,
              'percent': 100.0
            }, {
              'name': '',
              'amt': 100,
              'percent': 100.0
            }],
            'dataHead': [{
              'name': 'name',
              'label': '股东'
            }, {
              'name': 'amt',
              'label': '股本（万元）'
            }, {
              'name': 'percent',
              'label': '持股比例'
            }]
          }]
        }, {
          'step': 2,
          'title': '专业团队',
          'qList': [{
            'q': 'Q6',
            'tg': 'teamtrace',
            'is': 'dynamic-table',
            'data': [{
              'annual': '',
              'size': '',
              'changeDescription': ''
            }, {
              'annual': '',
              'size': '',
              'changeDescription': ''
            }, {
              'annual': '',
              'size': '',
              'changeDescription': ''
            }],
            'dataHead': [{
              'name': 'annual',
              'label': '年度'
            }, {
              'name': 'size',
              'label': '团队员工数目'
            }, {
              'name': 'changeDescription',
              'label': '关键人员变动情况说明'
            }]
          }, {
            'q': 'Q7',
            'tg': 'keystaff',
            'is': 'dynamic-table',
            'data': [{
              'name': '',
              'pos': '',
              'entrydate': '',
              'edu': '',
              'career': ''
            },
            {
              'name': '',
              'pos': '',
              'entrydate': '',
              'edu': '',
              'career': ''
            },
            {
              'name': '',
              'pos': '',
              'entrydate': '',
              'edu': '',
              'career': ''
            }],
            'dataHead': [{
              'name': 'name',
              'label': '姓名'
            },
            {
              'name': 'pos',
              'label': '职位'
            },
            {
              'name': 'entrydate',
              'label': '入职日期'
            },
            {
              'name': 'edu',
              'label': '教育背景'
            },
            {
              'name': 'career',
              'label': '职业经历'
            }]
          }, {
            'q': 'Q8',
            'tg': 'teamstability',
            'is': 'dynamic-table',
            'data': [{
              'pos': '',
              'curr': '',
              'decrease': '',
              'increase': '',
              'depercent1yr': '',
              'decincper': ''
            },
            {
              'pos': '',
              'curr': '',
              'decrease': '',
              'increase': '',
              'depercent1yr': '',
              'decincper': ''
            },
            {
              'pos': '',
              'curr': '',
              'decrease': '',
              'increase': '',
              'depercent1yr': '',
              'decincper': ''
            }],
            'dataHead': [{
              'name': 'pos',
              'label': '岗位'
            },
            {
              'name': 'curr',
              'label': '目前人数'
            },
            {
              'name': 'decrease',
              'label': '离职人数'
            },
            {
              'name': 'increase',
              'label': '新增人数'
            },
            {
              'name': 'depercent1yr',
              'label': '近一年离职率'
            },
            {
              'name': 'decincper',
              'label': '离职及新增人员变动百分比'
            }]
          }, {
            'q': 'Q9',
            'tg': 'kpidesc',
            'is': 'input',
            'data': ''
          }]
        }, {
          'step': 3,
          'title': '公司运营管理',
          'qList': [{
            'q': 'Q10',
            'tg': 'riskframework',
            'is': 'input',
            'data': ''
          }, {
            'q': 'Q11',
            'tg': 'comlianceregulation',
            'is': 'input',
            'data': ''
          }, {
            'q': 'Q12',
            'tg': 'hasStandarditproduct',
            'is': 'option',
            'data': ''
          }, {
            'q': 'Q13',
            'tg': 'itproductdetail',
            'is': 'input',
            'data': ''
          }, {
            'q': 'Q14',
            'tg': 'datastorelifecycle',
            'is': 'input',
            'data': ''
          }]
        }, {
          'step': 4,
          'title': '公司优劣势',
          'qList': [{
            'q': 'Q15',
            'tg': 'swot',
            'is': 'input',
            'data': ''
          }]
        }, {
          'step': 5,
          'title': '外部服务商',
          'qList': [{
            'q': 'Q16',
            'tg': 'externalprovider',
            'is': 'dynamic-table',
            'data': [{
              'type': '',
              'name': '',
              'interface': '',
              'contact': ''
            }],
            'dataHead': [{
              'name': 'type',
              'label': '服务类型'
            },
            {
              'name': 'name',
              'label': '服务商名称'
            },
            {
              'name': 'interface',
              'label': '服务商联系人'
            },
            {
              'name': 'contact',
              'label': '服务商联系方式'
            }]
          }]
        }, {
          'step': 6,
          'title': '与知名金融机构合作情况',
          'qList': [{
            'q': 'Q17',
            'tg': 'cooperationdetail',
            'is': 'dynamic-table',
            'data': [{
              'financename': '',
              'productname': '',
              'productscale': '',
              'foundat': ''
            }],
            'dataHead': [{
              'name': 'financename',
              'label': '金融机构名称'
            },
            {
              'name': 'productname',
              'label': '合作产品名称'
            },
            {
              'name': 'productscale',
              'label': '合作产品规模'
            },
            {
              'name': 'foundat',
              'label': '产品成立时间'
            }]
          }]
        }]
      },
      riskcontrol: {
        'ticket': 'FA02-C032-26372-04D1A',
        'size': 2,
        'data': [{
          'step': 1,
          'title': '机构风险控制',
          'qList': [{
            'q': 'Q18',
            'tg': 'interInvestRiskControl',
            'is': 'fixed-table',
            'fixed': true,
            'data': [{
              'point': 'Q18_1',
              'detailDesc': ''
            }, {
              'point': 'Q18_2',
              'detailDesc': ''
            }, {
              'point': 'Q18_3',
              'detailDesc': ''
            }, {
              'point': 'Q18_4',
              'detailDesc': ''
            }, {
              'point': 'Q18_5',
              'detailDesc': ''
            }, {
              'point': 'Q18_6',
              'detailDesc': ''
            }, {
              'point': 'Q18_7',
              'detailDesc': ''
            }, {
              'point': 'Q18_8',
              'detailDesc': ''
            }],
            'dataHead': [{
              'name': 'point',
              'label': '要点',
              'columnWidth': '250px',
              'isEditable': false
            }, {
              'name': 'detailDesc',
              'label': '详细描述',
              'columnWidth': '250px',
              'viewas': 'pre'
            }]
          }]
        }, {
          'step': 2,
          'title': '机构风险控制',
          'qList': [{
            'q': 'Q19',
            'tg': 'riskcontrolfeature',
            'is': 'input',
            'data': ''
          }, {
            'q': 'Q20',
            'tg': 'downsideriskcontrol',
            'is': 'input',
            'data': ''
          }]
        }]
      },
      reports: {},
      // end
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      markdownContent: '12345678',
      listQuery: {
        page: 1,
        limit: 4,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
      statusOptions: ['待审核', '核准', '核拒'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    customContentWrapper(data) {
      const wrapMap = {
        'Q18_1': '投资风险的管理流程',
        'Q18_2': '控制投资风险的量化工具及监控指标',
        'Q18_3': '风险监控系统或软件',
        'Q18_4': '投资组合是如何做风险对冲的？\n对风险对冲的动态调整频率是多少？',
        'Q18_5': '描述一下杠杆使用的原则，以及在不同市场周期如何管理杠杆水平？',
        'Q18_6': '投资组合的分散化程度？',
        'Q18_7': '如何控制投资组合之间的相关性？如何处理不同产品／投资组合间的公平交易问题？',
        'Q18_8': '公司如何保证流动性（赎回、头寸流动性）？如何衡量头寸的最低流动性需求？'
      }
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
    handleNextStep() {
      // eslint-disable-next-line eqeqeq
      if (this.currentStep == this.currentDataSet.data.length) {
        return
      } else {
        this.currentStep += 1
        this.currentStepData = this.getXstep(this.currentStep)
      }
    },
    getXstep(stepIndex) {
      const dataArr = this.currentDataSet.data
      // eslint-disable-next-line eqeqeq
      return dataArr.filter(step => step.step == stepIndex)[0]
    },
    getList() {
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   console.log(JSON.stringify(this.list))
      //   this.total = response.data.total
      //
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
      this.listLoading = true
      this.list = [{
        'id': 1,
        'title': '公司情况',
        'ticket': 'FA02-C032-26372-04D1A',
        'status': '未填写'
      }, {
        'id': 2,
        'title': '投资分析',
        'ticket': 'FA02-C032-26372-04D1A',
        'status': '未填写'
      }, {
        'id': 3,
        'title': '风险控制',
        'ticket': 'FA02-C032-26372-04D1A',
        'status': '未填写'
      }, {
        'id': 4,
        'title': '历史业绩',
        'ticket': 'FA02-C032-26372-04D1A',
        'status': '未填写'
      }, {
        'id': 5,
        'title': '资料清单',
        'ticket': 'FA02-C032-26372-04D1A',
        'status': '未填写'
      }]
      this.listLoading = false
      this.total = this.listLoading.length
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
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

    handleUpdate(row) {
      this.currentStep = 1
      let flag = false
      switch (row.title) {
        case '公司情况':
          this.currentDataSet = this.comstandardinfo
          flag = true
          break
        case '投资分析':
          break
        case '风险控制':
          flag = true
          this.currentDataSet = this.riskcontrol
          break
        case '历史业绩':
          break
        case '资料清单':
          break
        default:
          break
      }
      if (!flag) {
        return
      }
      this.currentStepData = this.getXstep(this.currentStep)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   const index = this.list.findIndex(v => v.id === this.temp.id)
          //   this.list.splice(index, 1, this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Update Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    debugData(data) {
      console.log(this.markdownContent)
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
</style>
