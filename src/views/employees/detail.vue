<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <el-form
              ref="userForm"
              :model="userInfo"
              :rules="rules"
              label-width="120px"
              style="margin-top: 30px; margin-left: 120px"
            >
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" style="width: 20%" />
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="userInfo.password2" style="width: 20%" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfoById">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>

            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserInfoById } from '@/api/user'
import { updateUserInfoById } from '@/api/employees'
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'

export default {
  name: '',
  components: {
    UserInfo,
    JobInfo
  },
  props: {},
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度为 6-9 为', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserInfoById()
  },
  mounted() {},
  methods: {
    async getUserInfoById() {
      this.userInfo = await getUserInfoById(this.userId)
    },
    updateUserInfoById() {
      this.$refs.userForm.validate().then(async(valid) => {
        if (valid) {
          await updateUserInfoById({
            ...this.userInfo,
            password: this.userInfo.password2
          })
          this.$message.success('修改用户信息成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
