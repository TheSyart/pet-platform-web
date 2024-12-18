<template>
  <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
    :on-success="handleAvatarSuccess">
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>

</template>

<script>
import axios from 'axios';

export default {
  name: 'ImgUploader',
  props: {
    type: {
      type: String,
      required: true, // 父组件必须传入 type 参数
    },
  },
  data() {
    return {
      imageUrl: '',
      uploadUrl: '/api/pic/webUpload',  // 上传路径，可以根据需要动态设置
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$emit('upload-success', file.raw);  // 通知父组件上传成功
    },

    beforeAvatarUpload(file) {
      // 上传前的验证逻辑
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }

      // 返回 true 会继续上传，false 会阻止上传
      if (isJPG && isLt2M) {
        this.imageUrl = URL.createObjectURL(file);  // 生成本地文件的 URL 并设置到 imageUrl
        this.UploadFile(file);  // 调用自定义上传方法
        return false;  // 阻止默认上传操作
      }
      return false;  // 不上传
    },
    UploadFile(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dir', this.type);  // 确保传递 dir 参数

      // 使用 axios 发送上传请求
      axios.post(this.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: `${localStorage.getItem('jwt')}`,  // 可根据需要添加 token 等身份验证
        },
      })
        .then((response) => {
          console.log('上传成功:', response.data.data);
          this.$emit('upload-success', response.data.data);  // 通知父组件上传成功
        })
        .catch((error) => {
          console.error('上传失败:', error);
        });
    },
    clearImage() {
      // 清除图片并释放本地 URL
      if (this.imageUrl) {
        URL.revokeObjectURL(this.imageUrl); // 释放内存
        this.imageUrl = '';
      }
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: auto;
  max-width: 180px;
  height: auto;
  display: block;
}
</style>
