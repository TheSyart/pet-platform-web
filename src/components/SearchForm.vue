<template>
  <div ref="searchFormRef">
    <el-form :inline="true" :model="localSearchForm" @submit.native.prevent="onSubmit">
      <el-form-item :label="item.label" v-for="(item, index) in formItems" :key="index">
        <component :is="item.component" v-model="localSearchForm[item.prop]" v-bind="item.props">
          <!-- 如果是 el-select，插入选项 -->
          <template v-if="item.component === 'el-select'">
            <el-option v-for="(opt, optIndex) in item.options" :key="optIndex" :label="opt" :value="optIndex" />
          </template>
        </component>
      </el-form-item>

      <!-- 查询按钮 -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>

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
      localSearchForm: { ...this.searchForm },
      resizeObserver: null
    };
  },
  methods: {
    onSubmit() {
      // 提交时将修改后的数据传递给父组件
      this.$emit('submit', this.localSearchForm);
    },
    getSearchFormHeight() {
      const formHeight = this.$refs.searchFormRef.offsetHeight;
      this.$emit("get-search-form-height", formHeight);
    },
    handleResize(entries) {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          // 浏览器支持 contentBoxSize
          const height = entry.contentBoxSize[0].blockSize;
          // 使用延迟避免直接在回调中触发 DOM 改变
          requestAnimationFrame(() => {
            this.$emit("get-search-form-height", height);
          });
        } else {
          // 浏览器不支持 contentBoxSize
          const height = entry.contentRect.height;
          // 使用延迟避免直接在回调中触发 DOM 改变
          requestAnimationFrame(() => {
            this.$emit("get-search-form-height", height);
          });
        }
      }
    }
  },
  mounted() {
    this.getSearchFormHeight();
    this.$nextTick(() => {
      if (this.$refs.searchFormRef) {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.$refs.searchFormRef);
      } else {
        console.warn('searchFormRef is not available');
      }
    });
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
};
</script>