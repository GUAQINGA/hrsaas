<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon icon-class="language" style="color: #fff;font-size: 20px" />
    </div>
    <el-dropdown-menu>
      <el-dropdown-item :disabled="$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="$i18n.locale === 'en'" command="en">EN</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    changeLanguage(lang) {
      Cookie.set('language', lang)
      this.$i18n.locale = lang
      this.$message.success('切换语言成功')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
