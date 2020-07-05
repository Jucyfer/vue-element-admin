<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>摘要</span>
    </div>

    <div class="user-profile">
      <!--      <div class="box-center">-->
      <!--        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">-->
      <!--        <div>Hello</div>-->
      <!--        {{ user.com }}-->
      <!--        </pan-thumb>-->
      <!--      </div>-->
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <!--        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>-->
        <div class="user-role text-center text-muted">{{ user.com }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>用户信息</span></div>
        <div class="user-bio-section-body">
          <!--          <div class="text-muted">-->
          <!--            测试文字-->
          <!--          </div>-->
          <el-row gutter="20">
            <el-col span="8">
              <el-label color="major-text" shadow="1">姓名</el-label>
            </el-col>
            <el-col span="16">
              <el-label>{{ user.name }}</el-label>
            </el-col>
          </el-row>
          <el-row gutter="20">
            <el-col span="8">
              <el-label color="major-text" shadow="1">公司名称</el-label>
            </el-col>
            <el-col span="16">
              <el-label>{{ user.com }}</el-label>
            </el-col>
          </el-row>
          <el-row gutter="20">
            <el-col span="8">
              <el-label color="major-text" shadow="1">职务</el-label>
            </el-col>
            <el-col span="16">
              <el-tag v-for="item in user.position" :key="item + Math.random()">{{ item | positionFilter }}</el-tag>
            </el-col>
          </el-row>
          <el-row gutter="20">
            <el-col span="8">
              <el-label color="major-text" shadow="1">手机号</el-label>
            </el-col>
            <el-col span="16">
              <el-label>{{ user.mobile }}</el-label>
            </el-col>
          </el-row>
          <el-row gutter="20">
            <el-col span="8">
              <el-label color="major-text" shadow="1">邮箱</el-label>
            </el-col>
            <el-col span="16">
              <el-label>{{ user.mail }}</el-label>
            </el-col>
          </el-row>
          <el-row gutter="20">
            <el-col span="8">
              <el-link type="primary" @click.prevent="$router.push({ path: '/settings' })">
                点击此处修改信息
              </el-link>
            </el-col>
          </el-row>
        </div>
      </div>

      <!--      <div class="user-skills user-bio-section">-->
      <!--        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>以下忽略</span></div>-->
      <!--        <div class="user-bio-section-body">-->
      <!--          <div class="progress-item">-->
      <!--            <span>Vue</span>-->
      <!--            <el-progress :percentage="70" />-->
      <!--          </div>-->
      <!--          <div class="progress-item">-->
      <!--            <span>JavaScript</span>-->
      <!--            <el-progress :percentage="18" />-->
      <!--          </div>-->
      <!--          <div class="progress-item">-->
      <!--            <span>Css</span>-->
      <!--            <el-progress :percentage="12" />-->
      <!--          </div>-->
      <!--          <div class="progress-item">-->
      <!--            <span>ESLint</span>-->
      <!--            <el-progress :percentage="100" status="success" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </el-card>
</template>

<script>
// import PanThumb from '@/components/PanThumb'
import elLabel from '@/components/elementx/simple/label/el-label'
import store from '@/store/index'
export default {
  components: { elLabel },
  filters: {
    positionFilter(param) {
      return store.getters.employeepositionTranslation[param]
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          // avatar: '',
          roles: '',
          mobile: '',
          mail: '',
          position: [],
          businessCardId: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin-top: 20px;
    margin-bottom: 20px;
  }
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
