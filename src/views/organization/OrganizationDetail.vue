<template>
  <div style="padding: 20px">
    <el-label shadow="1" size="main-title" color="placeholder-text">机构详情（{{ orgDesc.companyFullName_CH }}）</el-label>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="0">
        <template slot="title">
          <el-label shadow="1" size="main-title" color="brand">机构情况</el-label>
        </template>
        <el-row gutter="20">
          <el-col span="24">
            <el-label size="sub-title" color="major-text">机构名称</el-label>
          </el-col>
          <el-col span="24">
            <el-label size="body" color="minor-text">{{ orgDesc.companyFullName_CH }}</el-label>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col span="24">
            <el-label size="sub-title" color="major-text">机构会员号</el-label>
          </el-col>
          <el-col span="24">
            <el-label size="body" color="minor-text">{{ orgDesc.registrationSerial }}</el-label>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col span="24">
            <el-label size="sub-title" color="major-text">协会规模（万元）</el-label>
          </el-col>
          <el-col span="24">
            <el-label size="body" color="minor-text">{{ orgDesc.amacFundScale }}</el-label>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col span="24">
            <el-label size="sub-title" color="major-text">管理规模（万元）</el-label>
          </el-col>
          <el-col span="24">
            <el-label size="body" color="minor-text">{{ (orgDesc.managementScale * 10000) | valueValidator }}</el-label>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col span="24">
            <el-label size="sub-title" color="major-text">基金策略</el-label>
          </el-col>
          <el-col span="24">
            <el-label v-if="!orgDesc.strategy || orgDesc.strategy.length===0" size="body" color="minor-text">--</el-label>
            <el-tag v-for="item in orgDesc.strategy" v-else :key="item + Math.random()">{{ item | strategyFilter }}</el-tag>
            <!--            <el-label size="body" color="minor-text">{{ orgDesc.strategy }}</el-label>-->
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col span="24">
            <el-label size="sub-title" color="major-text">办公地址</el-label>
          </el-col>
          <el-col span="24">
            <el-label size="body" color="minor-text">{{ orgDesc.officeAddr }}</el-label>
          </el-col>
        </el-row>
        <el-row gutter="20">
          <el-col span="24">
            <el-label size="sub-title" color="major-text">对接人</el-label>
          </el-col>
          <el-col span="24">
            <el-label size="body" color="minor-text">{{ orgDesc.agent | valueValidator }}</el-label>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="1">
        <template slot="title">
          <el-label shadow="1" size="main-title" color="brand">尽调报告</el-label>
        </template>
        <el-button type="primary" @click="handleViewReport">点击查看机构尽调报告</el-button>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <el-label shadow="1" size="main-title" color="brand">人员概览</el-label>
        </template>
        <!--          <el-label size="main-title" color="placeholder-text" shadow="1">人员概览占位符</el-label>-->
        <staff-list :override-pid="pathPid"></staff-list>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <el-label shadow="1" size="main-title" color="brand">基金概览</el-label>
        </template>
        <!--          <el-label size="main-title" color="placeholder-text" shadow="1">基金概览占位符</el-label>-->
        <el-label size="sub-title" color="general-text" shadow="1">内容类型选择:</el-label>
        <el-radio-group v-model="fundRadioValue">
          <el-radio-button label="基金信息列表"></el-radio-button>
          <el-radio-button label="基金净值列表"></el-radio-button>
        </el-radio-group>
        <fund-list v-if="fundRadioValue === '基金信息列表'" :override-pid="pathPid"></fund-list>
        <fund-value-info-list v-if="fundRadioValue === '基金净值列表'" :override-pid="pathPid"></fund-value-info-list>
      </el-collapse-item>
    </el-collapse>
    <!--浮出的对话框-->
    <el-dialog
      v-if="isReportDialogShow"
      :title="尽调报告"
      :visible.sync="isReportDialogShow"
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
            :options="$store.getters.strategyCascade"
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
import elLabel from '@/components/elementx/simple/label/el-label'
import staffList from '@/views/employee/EmployeeInfomation'
import fundList from '@/views/fund/FundInfoList.vue'
import fundValueInfoList from '@/views/fund/FundValueList.vue'
import MarkdownEditor from '@/components/MarkdownEditor'
import DynamicTable from '@/views/table/DynamicTable'
import SingleFile from '@/components/Upload/SingleFile'
import store from '@/store/index'
export default {
  name: 'TestArea',
  filters: {
    valueValidator(param) {
      return param == null || param == 0 ? '--' : param
    },
    strategyFilter(param) {
      return store.getters.strategyMap[param]
    },
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
  components: {
    elLabel,
    staffList,
    fundList,
    fundValueInfoList,
    MarkdownEditor,
    DynamicTable,
    SingleFile
  },
  data() {
    return {
      tempRoute: {},
      pathPid: this.$route.params && this.$route.params.pid,
      activeNames: [],
      fundRadioValue: '基金信息列表',
      isReportDialogShow: false,
      currentQList: [],
      selectedCascade: [],
      isStaffListLoading: false,
      isFundListLoading: false,
      orgDesc: {}
    }
  },
  watch: {
    activeName(newValue) {
      console.log(newValue)
    }
  },
  async created() {
    this.$store.dispatch('questCommon/init_quest_CN_Map')
    this.$store.dispatch('questCommon/init_quest_Meta_Map')
    this.getOrgDesc()

    this.tempRoute = Object.assign({}, this.$route)
    this.setTagsViewTitle()
  },
  methods: {
    extractMeta(qid, index) {
      return this.$store.getters.questMetaMap[qid][index]
    },
    getCNTag(qid) {
      return this.$store.getters.questMap[qid] || qid
    },
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
      const wrapMap = store.getters.questMap
      return wrapMap[data] || data
    },
    async getOrgDesc() {
      const pid = this.$route.params && this.$route.params.pid
      if (!pid) return
      const { data } = await this.$axios.get('/secure/infomation/managers/' + pid)
      this.orgDesc = data
    },

    // 对话框加载函数
    async handleViewReport() {
      this.$store.commit('reports/ALTER_VIEW_ONLY', true)
      const { data: resp } = await this.$axios.get('/secure/approval/overview/' + this.pathPid + '?userid=' + this.$store.getters.userid)
      console.log('管理员角度获取到的用户answer：')
      console.log(resp)
      if (resp.length === 0) {
        this.$message.warning('该机构不存在尽调报告的相关记录')
        return
      }
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
      this.isReportDialogShow = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    // 对话框保存及关闭函数
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
      this.isReportDialogShow = false
      this.$nextTick(() => {
        this.currentQList = []
      })
    },
    closeDialog() {
      this.isReportDialogShow = false
      this.$nextTick(() => {
        this.currentQList = []
      })
    },
    // 路由设置相关
    setTagsViewTitle() {
      const title = '机构详情'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.pathPid}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    }
  }
}
</script>

<style lang="scss" scoped>
  /*@import "~@/styles/mixin.scss";*/
  /deep/ .el-collapse-item__header{
    height: auto;
    line-height: normal;
  }
  /deep/ .el-collapse-item__arrow{
    margin:unset;
  }
  /deep/.el-collapse-item__content{
    padding-top: 10px;
    padding-bottom: 10px;
  }
  /*
  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
   */
</style>
