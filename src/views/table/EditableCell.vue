<template>
  <div>
    <span v-if="!showEditor" @click="showEditor=true">{{ currentValue | validshow }}</span>
    <el-input
      v-if="showEditor"
      v-model="currentValue"
      v-insertfocus4el
      @blur="showEditor=false"
      @input="handleInput($event)"
    />
  </div>
</template>

<script>
export default {
  name: 'EditableCell',
  filters: {
    validshow(data) {
      return data || '无'
    }
  },
  directives: {
    insertfocus4el: {
      inserted(el) {
        // el.firstElementChild.focus()
        el.firstElementChild.select()
      }
    }
  },
  props: ['value'],
  event: ['input'],
  data() {
    return {
      showEditor: false,
      currentValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue
    }
  },
  methods: {
    handleInput(e) {
      this.currentValue = e
      this.$emit('input', this.currentValue)
    }
  }

}
</script>

<style scoped>
    span{
        display: block;
        width: 100%;
    }
</style>
