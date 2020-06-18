<template>
  <div>
    <!--    action="/secure/invest/attachment/upload"-->
    <el-upload
      :action="'/secure/invest/attachment/' + $store.getters.comId+'?userid=' + $store.getters.userid"
      :headers="{token:$store.getters.token}"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <el-button v-if="!currentValue" size="small" type="primary">点击上传</el-button>
      <span style="display: block;cursor:pointer">文件序列号:{{ value }}</span>
    </el-upload>
    <el-button size="small" type="primary" @click="handleDownload">点击下载</el-button>
  </div>
</template>

<script>
export default {
  name: 'SingleFile',
  props: {
    value: {
      type: String
    }
  },
  event: ['input'],
  data() {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    }
  },
  methods: {
    handleSuccess(response, file) {
      this.currentValue = response
      this.$emit('input', this.currentValue)
      this.$message.success('上传成功')
    },
    handleError(err, file) {
      console.log(file, err)
      this.$message.error('上传失败')
    },
    handleDownload() {
      // this.$axios.get('/secure/invest/attachment/' + this.$store.getters.comId + '/' + this.currentValue + '?userid=' + this.$store.getters.userid)
      this.$message.warning('下载功能当前暂不开放，请谅解！')
    }
  }
}
</script>

<style scoped>

</style>
