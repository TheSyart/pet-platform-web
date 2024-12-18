<!-- ServiceDialog.vue -->
<template>
    <el-dialog :title="title" :visible.sync="visible">
      <el-form :model="form">
        <slot :form="form" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </template>
  
  <script>
  export default {
    props: {
      title: String,
      visible: Boolean,
      form: Object
    },
    methods: {
      cancel() {
        this.$emit('cancel');
      },
      confirm() {
        this.$emit('confirm', this.form);
      }
    }
  };
  </script>
  