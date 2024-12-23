<template>
    <el-dialog
      :visible.sync="visible"
      :title="title"
      :before-close="handleClose"
      width="30%"
    >
      <p>{{ message }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        visible: false, // 控制对话框的显示和隐藏
        title: '',      // 对话框标题
        message: ''     // 对话框内容
      };
    },
    methods: {
      openDialog({ title = '默认标题', message = '默认内容' }) {
        this.title = title;
        this.message = message;
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      confirm() {
        this.$message({
          type: 'success',
          message: `确定按钮点击了`
        });
        this.close();
      },
      handleClose(done) {
        done();
      }
    }
  };
  </script>
  
  <style scoped>
  /* 可自定义样式 */
  </style>
  