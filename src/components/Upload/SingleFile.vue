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
    <el-link
      v-if="currentValue"
      :href="'/secure/invest/attachment/'+$store.getters.token+'/'+ $store.getters.userid +'/'+currentValue"
      target="_blank"
    >
      <el-button size="small" type="primary">点击下载</el-button>
    </el-link>
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
    }
  }
}
</script>

<style scoped>

</style>
