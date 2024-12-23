<template>
  <el-form :inline="true" :model="localSearchForm" @submit.native.prevent="onSubmit">
    <el-row :gutter=gutter>
      <!-- 遍历 formItems，生成表单项 -->
      <el-col :span="5.5" v-for="(item, index) in formItems" :key="index">
        <el-form-item :label="item.label">
          <component :is="item.component" v-model="localSearchForm[item.prop]" v-bind="item.props">
            
            <!-- 如果是 el-select，插入选项 -->
            <template v-if="item.component === 'el-select'">
              <el-option v-for="(opt, optIndex) in item.options" :key="optIndex" :label="opt" :value="optIndex" />
            </template>
          </component>
        </el-form-item>
      </el-col>

      <!-- 查询按钮 -->
      <el-col :span="4">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  props: {
    searchForm: { type: Object, required: true },
    formItems: { type: Array, required: true }
  },
  watch: {
    searchForm: {
      handler(newValue) {
        this.localSearchForm = { ...newValue };
      },
      deep: true
    }
  },
  data() {
    return {
      gutter: 5, // 数字类型
      // 使用一个本地的副本来操作
      localSearchForm: { ...this.searchForm }
    };
  },
  methods: {
    onSubmit() {
      // 提交时将修改后的数据传递给父组件
      this.$emit('submit', this.localSearchForm);
    }
  }
};
</script>
