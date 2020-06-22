<template>
  <div class="reg-container">
    <el-form ref="regForm" :model="regForm" :rules="regRules" class="reg-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>

      <el-form-item prop="name">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="name"
          v-model="regForm.name"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="off"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="auth">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="auth"
            v-model="regForm.auth"
            :type="passwordType"
            placeholder="登录密码"
            name="password"
            tabindex="2"
            autocomplete="off"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="authRecheck">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="auth"
            v-model="regForm.authRecheck"
            :type="passwordType"
            placeholder="确认登录密码"
            name="authRecheck"
            tabindex="3"
            autocomplete="off"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="realName">
        <span class="svg-container">
          <svg-icon icon-class="name" />
        </span>
        <el-input
          ref="name"
          v-model="regForm.realName"
          placeholder="真实姓名"
          name="realName"
          type="text"
          tabindex="4"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="name" />
        </span>
        <el-input
          ref="mobile"
          v-model="regForm.mobile"
          placeholder="手机号码"
          name="mobile"
          type="text"
          tabindex="5"
          maxlength="11"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="company">
        <span class="svg-container">
          <svg-icon icon-class="company" />
        </span>
        <el-select
          :value="regForm.company"
          filterable
          remote
          placeholder="公司关键字或完整协会编号"
          :loading="companyLoading"
          :remote-method="companyRemoteMethod"
          tabindex="6"
          @change="bindChange"
        >
          <el-option
            v-for="item in companyRemoteList"
            :key="item.companyId"
            :label="item.companyName"
            :value="item"
          >
            <span style="float: left">{{ item.companyName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.companyId }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="position">
        <span class="svg-container">
          <svg-icon icon-class="tree" />
        </span>
        <el-select ref="position" v-model="regForm.position" tabindex="7" multiple collapse-tags clearable placeholder="职位" name="position">
          <el-option
            v-for="item in $store.getters.employeePositionOptions"
            :key="item.value + Math.random()"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="mail">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="mail"
          v-model="regForm.mail"
          placeholder="电子邮箱"
          name="mail"
          type="text"
          tabindex="8"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="businessCard">
        <span class="svg-container">
          <svg-icon icon-class="businessCard" />
        </span>
        <el-input
          ref="businessCard"
          v-model="regForm.businessCard"
          placeholder="点击下方上传图片"
          name="businessCard"
          type="text"
          tabindex="9"
          autocomplete="off"
          :readonly="true"
        />
        <!--        class="avatar-uploader"-->
        <el-upload
          class="avatar-uploader el-uploads"
          action="/common/upload/businesscard"
          :show-file-list="false"
          :on-success="handleBusinessCardSuccess"
          tabindex="10"
        >
          <img v-if="businessCardFacade" :src="businessCardFacade" class="avatar">
          <i v-else class="el-icon-picture avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Submit</el-button>
    </el-form>

  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import store from '@/store/index'
import _ from 'lodash'
export default {
  name: 'Register',
  filters: {
    positionFilter(param) {
      return store.getters.employeepositionTranslation[param]
    }
  },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     // callback(new Error('The password can not be less than 6 digits'))
    //     callback()
    //   } else {
    //     callback()
    //   }
    // }
    const validateRePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Pls enter password'))
      } else if (!value === this.regForm.auth) {
        callback(new Error('Password Not Same!'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('Invalid Email Address!'))
      } else {
        callback()
      }
    }
    const validateArray = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('Must choose at least 1 position!'))
      } else {
        callback()
      }
    }
    return {
      companyLoading: false,
      companyRemoteList: [],
      selectedCompany: {},
      businessCardFacade: '',
      regForm: {
        name: '',
        auth: '',
        authRecheck: '',
        realName: '',
        mobile: '',
        company: '',
        orgId: '',
        position: [],
        mail: '',
        businessCard: ''
      },
      regRules: {
        // name: [{ required: true, trigger: 'blur', validator: validateUsername }],
        name: [{ required: true, trigger: 'blur' }],
        // auth: [{ required: true, trigger: 'blur', validator: validatePassword }],
        auth: [{ required: true, trigger: 'blur' }],
        authRecheck: [{ required: true, trigger: 'blur', validator: validateRePassword }],
        realName: [{ required: true, trigger: 'blur', min: 2, message: 'Invalid RealName' }],
        mobile: [{ required: true, trigger: 'blur', min: 7, max: 11 }],
        mail: [{ required: true, trigger: 'blur', validator: validateEmail }],
        company: [{ required: true, trigger: 'blur', message: 'Company can not empty' }],
        position: [{ required: true, trigger: 'change', validator: validateArray }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    },
    selectedCompany(newValue, oldValue) {
      this.regForm.company = newValue.companyName
      this.regForm.orgId = newValue.companyId
      console.log('regForm', this.regForm)
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    window.document.getElementsByClassName('el-upload')[0].style.display = 'block'
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    bindChange(e) {
      this.selectedCompany = e
    },
    companyRemoteMethod: _.debounce(async function(keyword) {
      if (!keyword) {
        return
      }
      this.companyLoading = true
      const { data: responseList } = await this.$axios.get('/common/search/company/' + keyword)
      this.companyRemoteList = responseList
      this.companyLoading = false
    }, 666),
    handleBusinessCardSuccess(res, file) {
      console.log(res)
      this.regForm.businessCard = res
      this.businessCardFacade = URL.createObjectURL(file.raw)
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.regForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/register', this.regForm)
            .then(() => {
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.$message.success('注册成功！')
              this.$router.push({ path: '/login' })
              this.loading = false
            })
            .catch(() => {
              this.$message.error('提交失败！请联系管理员！')
              this.loading = false
            })
        } else {
          this.$message.error('请正确填写表格！')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .reg-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.reg-container {
  .el-input {
    /*display: inline-block;*/
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-select {
    /*display: inline-block;*/
    height: 47px;
    width: 90%;
    .el-input {
      position: static;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;

  }
}
</style>

<style lang="scss" scoped>
  //$bg:#2d3a4b;
  $bg:#5d6a7b;
$dark_gray:#889aa4;
$light_gray:#eee;

.reg-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .reg-form {
    /*position: relative;*/
    width: 520px;
    max-width: 100%;
    padding: 5% 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
<style scoped>
  .el-uploads .el-upload__text{
    display: block !important;
  }
  /*.avatar-uploader * {*/
  /*  display: block !important;*/
  /*}*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 70px;
    color: #8c939d;
    width: 100%;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 178px;
    display: block;
    text-align: center;
  }
</style>
