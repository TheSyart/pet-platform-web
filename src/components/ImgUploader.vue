<template>
  <el-upload class="avatar-uploader" action="#" :show-file-list="false" :before-upload="beforeAvatarUpload"
    :disabled="disabled || !!internalImageUrl">
    <!-- 默认状态：上传按钮 -->
    <div v-if="!internalImageUrl" class="upload-placeholder">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </div>

    <!-- 图片已上传：显示图片和操作按钮 -->
    <div v-else :style="{ pointerEvents: disabled ? 'none' : 'auto' }" class="uploaded-image-wrapper"
      @mouseover="hovered = true" @mouseleave="hovered = false">
      <img :src="internalImageUrl" class="avatar" />
      <div class="image-overlay" v-if="hovered">
        <span @click="handlePreview" class="image-action">
          <i class="el-icon-zoom-in"></i>
        </span>
        <span @click="handleDownload" class="image-action">
          <i class="el-icon-download"></i>
        </span>
        <span @click.stop="deleteImage" class="image-action">
          <i class="el-icon-delete"></i>
        </span>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="internalImageUrl" />
    </el-dialog>

  </el-upload>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
import { deleteFile } from '@/api/common/image';
export default {
  name: "ImgUploader",
  props: {
    type: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    id: {
      type: [String, Number], // 允许字符串或数字
      default: "",
    },
    fetchDelete: {
      type: Function,
      default: () => {
      }
    },
  },
  data() {
    return {
      uploadUrl: "/api/handlePic/webUpload", // 上传路径
      uploadBackPath: "",
      internalImageUrl: this.imageUrl, // 用于展示的图片路径
      hovered: false, // 控制悬浮状态
      dialogVisible: false,
      oo: "ss"
    };
  },
  watch: {
    imageUrl(newVal) {
      this.internalImageUrl = newVal;
    },
    // disabled(newVal) {
    //   if (newVal) {
    //     console.log("禁用状态", newVal);
    //   } else {
    //     console.log("启用状态", newVal);
    //   }
    // },
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      if (isJPG && isLt2M) {
        this.internalImageUrl = URL.createObjectURL(file); // 显示本地图片
        this.uploadFile(file); // 上传图片
        return false; // 阻止默认上传行为
      }
      return false;
    },
    uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dir", this.type);

      axios
        .post(this.uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: `${localStorage.getItem("jwt")}`,
          },
        })
        .then((response) => {
          const backPath = response.data.data
          Message.success("照片上传成功!");
          this.uploadBackPath = backPath;         //保存返回路径
          this.$emit("upload-success", backPath); // 通知父组件上传成功
        })
        .catch((error) => {
          Message.error("照片上传失败" + error + "!");
        });
    },
    clearImage() {
      if (this.internalImageUrl) {
        URL.revokeObjectURL(this.internalImageUrl); // 释放内存
        this.internalImageUrl = "";
      }
    },

    handlePreview() {
      this.preview = this.internalImageUrl;
      this.dialogVisible = true;
    },
    handleDownload() {
      this.$message.info("下载功能待实现");
    },

    async deleteImage() {
      try {
        let data = '';
        if (this.uploadBackPath) {
          data = { dir: this.uploadBackPath };
          this.uploadBackPath = '';   // 因为组件在我再次打开时，不会重置，所以手动清空路径
        } else {
          data = { dir: this.internalImageUrl };
        }

        const response = await deleteFile(data);
        console.log(response);
        this.updateImage();

        this.clearImage();
      } catch (error) {
        Message.error(error.response?.data?.message || '照片删除失败');
      }
    },
    async updateImage() {
      if (this.id && this.fetchDelete && !this.uploadBackPath) {
        try {
          const response = await this.fetchDelete(this.id);
          Message.success(response.data || "照片删除成功!");
        } catch (error) {
          Message.error(error.response?.data?.message || '照片删除失败');
        }
      }
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  position: relative;
  display: inline-block;
  width: 178px;
  height: 178px;
}

.upload-placeholder {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.uploaded-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  /* 背景变黑 */
  display: flex;
  align-items: center;
  justify-content: space-around;
  opacity: 1;
  transition: opacity 0.3s;
  border-radius: 6px;
  z-index: 10;
  /* 设置一个较低的层级 */
}


.image-action {
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.image-action:hover {
  color: #409eff;
}
</style>
