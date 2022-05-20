<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools>
      <template slot="after">
        <el-button type="primary" size="small" @click="onClick">Click</el-button>
      </template>
    </page-tools>
    <image-upload></image-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {},
  created() {},
  mounted() {
    // console.log(this.$store.state.user.userInfo)
    console.log(this.$store.getters.userInfo)
    // this.$store.dispatch('permission/filterRoutes' this.$store.)
  },
  methods: {
    onClick() {
      // console.log(this.$store.state.user.userInfo.roles.menus)
      this.$store.dispatch(
        'permission/filterRoutes',
        this.$store.state.user.userInfo.roles.menus
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
