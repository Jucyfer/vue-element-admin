<template>
  <div>
    <el-form ref="alterForm" :model="currentUser" :rules="formRules" label-position="left">
      <el-form-item label="真实姓名">
        <div>{{ currentUser.name }}</div>
      </el-form-item>
      <el-form-item label="公司名称">
        <div>{{ currentUser.com }}</div>
      </el-form-item>
      <el-form-item label="新密码（留空即不更改）" prop="auth">
        <el-input v-model.trim="currentUser.auth" type="password" />
      </el-form-item>
      <el-form-item v-if="currentUser.auth" label="确认新密码（留空即不更改）" prop="retypeAuth">
        <el-input v-model.trim="currentUser.retypeAuth" type="password"  />
      </el-form-item>
      <el-form-item label="职务" prop="position">
        <el-select ref="position" v-model="currentUser.position" style="width:100%" multiple collapse-tags clearable placeholder="position" name="position">
          <el-option
            v-for="item in $store.getters.employeePositionOptions"
            :key="item.value + Math.random()"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model.trim="currentUser.mobile" />
      </el-form-item>
      <el-form-item label="邮箱" prop="mailaddr">
        <el-input v-model.trim="currentUser.mailaddr" />
      </el-form-item>
      <!--      名片！！-->

      <el-form-item label="名片" prop="businessCardId">
        <!--        <span class="svg-container">-->
        <!--          <svg-icon icon-class="businessCard" />-->
        <!--        </span>-->

        <el-upload
          class="avatar-uploader"
          action="/common/upload/businesscard"
          :show-file-list="false"
          :on-success="handleBusinessCardSuccess"
          style="width:100%"
        >
          <el-input
            ref="businessCardId"
            v-model="currentUser.businessCardId"
            placeholder="单击添加名片"
            name="businessCardId"
            type="text"
            autocomplete="off"
            :readonly="true"
          />
          <img v-if="businessCardFacade" :src="businessCardFacade" class="avatar">
          <!--          <i v-else class="el-icon-picture avatar-uploader-icon"></i>-->
        </el-upload>
      </el-form-item>

      <!--      名片！！结束-->
      <el-form-item>
        <el-button type="primary" @click="dialogShow=true">更新信息</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="确认提交" :visible.sync="dialogShow">
      <el-form ref="passForm" :model="currentUser" :rules="formRules">
        <el-form-item label="请输入当前密码" prop="currentAuth">
          <el-input v-model.trim="currentUser.currentAuth" type="password"  />
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submit">确认提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { validEmail } from '@/utils/validate'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          auth: '',
          retypeAuth: '',
          currentAuth: '',
          mailaddr: '',
          mobile: '',
          position: [],
          com: '',
          businessCardId: ''
        }
      }
    }
  },
  data() {
    const validateRePassword = (rule, value, callback) => {
      if (!value === this.currentUser.auth) {
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
      dialogShow: false,
      formRules: {
        currentAuth: [{ required: true, trigger: 'blur', message: '请输入当前密码' }],
        retypeAuth: [{ required: true, trigger: 'blur', validator: validateRePassword }],
        mobile: [{ required: true, trigger: 'blur', min: 7 }],
        mailaddr: [{ required: true, trigger: 'blur', validator: validateEmail }],
        position: [{ required: true, trigger: 'change', validator: validateArray }]
      },
      currentUser: this.user,
      businessCardFacade: ''
    }
  },
  watch: {
    user(newVaule, oldValue) {
      this.currentUser = newVaule
    }
  },
  mounted() {
    this.currentUser = this.user
  },
  methods: {
    submit() {
      console.log(this.$refs.alterForm)
      this.$refs.alterForm.validate(async valid1 => {
        console.log('valid1', valid1)
        if (valid1) {
          const valid2 = await this.$refs.passForm.validate().then(
            () => {
              return true
            },
            () => {
              return false
            }
          )
          if (valid2) {
            const form = _.cloneDeep(this.currentUser)

            if (!form.auth) {
              delete form.auth
            } else {
              // eslint-disable-next-line eqeqeq
              if (form.auth != form.retypeAuth) {
                this.$message.error('请正确输入新密码！')
                return false
              }
            }
            delete form.retypeAuth
            console.log(form)
            // 这里要写更新用户信息的代码
            this.$store.dispatch('user/updateInfo', form)
              .then(async() => {
                this.$message.success('修改成功！')
                await this.$store.dispatch('user/getInfo')
                this.$router.push({ path: '/profile/index' })
              })
              .catch(() => {
                this.$message.error('提交失败！')
              })
              // 更新结束
          } else {
            this.$message({
              message: '请输入当前密码',
              type: 'error',
              duration: 5 * 1000
            })
          }
        } else {
          this.$message({
            message: '请检查表格项',
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
    },
    handleBusinessCardSuccess(res, file) {
      this.currentUser.businessCardId = res
      this.businessCardFacade = URL.createObjectURL(file.raw)
    }
  }
}
</script>
<style scoped>
  .el-upload,.el-upload__text,.el-input{
    display: block !important;
    width:100% !important;
  }
</style>
