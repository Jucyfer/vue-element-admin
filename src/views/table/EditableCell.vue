<template>
  <div>
    <!--    <span v-if="!showEditor" class=".span" @click="showEditor = isEditable">{{ facadeValue | validshow }}</span>-->
    <component :is="viewas" v-if="!showEditor" class=".span" @click="showEditor = isEditable">{{ facadeValue | validshow }}</component>
    <el-input
      v-if="showEditor"
      v-model.trim="currentValue"
      v-insertfocus4el
      :type="editType||'text'"
      :autosize="editType=='textarea'"
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
      if (!data || (data.replace && data.replace(/\s/g, '').length === 0)) {
        return '无'
      } else {
        return data
      }
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
  props: { value: [Number, String, Array, Object], editType: String, editable: Boolean, customContentWrapper: Function, viewas: String },
  event: ['input'],
  data() {
    return {
      showEditor: false,
      currentValue: this.value
    }
  },
  computed: {
    isEditable() {
      return this.editable == null ? true : this.editable
    },
    facadeValue() {
      return this.customContentWrapper ? this.customContentWrapper(this.value) : this.value
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
  .span {
    display: block;
    width: 100%;
    word-break: break-word;
  }
</style>
