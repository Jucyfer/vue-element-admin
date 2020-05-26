<script>
export default {
  created() {
    const { params, query } = this.$route
    console.log('测试:' + this.$route.params.path)
    console.log(params)
    console.log(query)
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
