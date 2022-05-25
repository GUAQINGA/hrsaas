<template>
  <div>
    <svg-icon
      icon-class="fullscreen"
      style="width: 20px;height: 20px;color: #fff"
      @click="onClick"
    />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

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
    onClick() {
      if (!ScreenFull.isEnabled) {
        return this.$message.warning('当前全屏不可用')
      }
      ScreenFull.toggle()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
