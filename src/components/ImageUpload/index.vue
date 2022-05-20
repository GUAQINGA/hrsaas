<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChangeFile"
      :before-upload="beforeUpload"
      :file-list="fileList"
      :http-request="uploadImg"
      :class="{disabled : imageFile}"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percent" style="width:180px"></el-progress>
    <el-dialog :visible.sync="showDialog" title="头像预览">
      <el-row type="flex" justify="center">
        <img width="100%" :src="imgUrl" alt />
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDbzCH4ZmhNqeAOO8akcDWWFghiSv71jAK',
  SecretKey: 'yg7HAl480buwiDQM3UfbIjtlNkqfDWaO'
})

export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      fileList: [
        // {
        //   url: 'https://img1.baidu.com/it/u=4096419636,635686539&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        // }
      ],
      showDialog: false,
      imgUrl: '',
      currentImgUid: null,
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    imageFile() {
      return this.fileList.length === 1
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPreview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    onRemove(file) {
      this.fileList = this.fileList.filter((item) => {
        return item.uid !== file.uid
      })
    },
    onChangeFile(file, fileList) {
      this.fileList = fileList.map((item) => item)
    },
    beforeUpload(file) {
      const fileType = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!fileType.includes(file.type)) {
        this.$message.error('只能上传 JPG、GIF、BMP、PNG 格式的图片!')
        return false
      }
      const maxFileSize = 5 * 1024 * 1024
      if (file.size > maxFileSize) {
        this.$message.error('上传图片不能大于 5MB')
        return false
      }
      this.showPercent = true
      this.currentImgUid = file.uid
      return true
    },
    uploadImg(params) {
      if (params.file) {
        cos.putObject(
          {
            Bucket: 'image-1258631467',
            Region: 'ap-shanghai',
            Key: params.file.name,
            Body: params.file,
            StorageClass: 'STANDARD',
            onProgress: (progressData) => {
              this.percent = progressData.percent * 100
            }
          },
          (error, data) => {
            console.log(error || data)
            if (!error && data.statusCode === 200) {
              this.$message.success('头像上传成功')
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentImgUid) {
                  return { url: 'http://' + data.Location, upload: true }
                }
                return item
              })
            }
            this.showPercent = false
            this.percent = 0
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.disabled .el-upload--picture-card {
  display: none;
}
</style>
