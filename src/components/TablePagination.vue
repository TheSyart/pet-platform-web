<template>
  <div>

    <!-- 引用封装的 MessageDialog 组件 -->
    <MessageDialog ref="messageDialog" />

    <el-table :data="data" class="table-container" border align="center" header-align="center"
      :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="600px">
      <el-table-column v-for="(col, index) in columns" :key="index" :prop="col.prop" :label="col.label"
        :width="col.width" :align="col.align || 'center'">

        <template #default="{ row }">

          <!-- 操作列的转化 -->
          <template v-if="col.type === 'button'">
            <el-button v-for="(action, idx) in col.details.filter(item => item.value === row.status)" :key="idx"
              :type="action.color" size="mini" @click="handleAction(action, row)">
              {{ action.name }}
            </el-button>
          </template>

          <!-- 状态列的转化 -->
          <template v-else-if="col.type === 'tag'">
            <el-tag :type="col.details[0].color[row.status]" size="mini">
              {{ col.details[0].name[row.status] }} </el-tag>
          </template>

          <!-- 字典转化 -->
          <template v-else-if="col.type === 'transform'">
            {{ col.details[row[col.prop]] }}
          </template>

          <!-- 单位增加 -->
          <template v-else-if="col.type === 'unit'">
            {{ row[col.prop] + col.details[0].name }}
          </template>

          <template v-else>
            {{ row[col.prop] }}
          </template>

        </template>

      </el-table-column>
    </el-table>




    <!-- 分页部分 -->
    <div style="width: 100%; margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">

        <!-- 左侧: 每页显示数量 -->
        <el-pagination background layout="sizes" :page-size="pageSize" :total="total" @size-change="handleSizeChange"
          style="flex: 1; text-align: left;"></el-pagination>

        <!-- 中间: 页码切换 -->
        <div style="flex: 1; display: flex; justify-content: center;">
          <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
            :current-page="currentPage" @current-change="handlePageChange"></el-pagination>
        </div>

        <!-- 右侧: 跳转和总数 -->
        <div style="flex: 1; display: flex; justify-content: flex-end;">
          <el-pagination background layout="jumper" style="margin-right: 10px;"
            @current-change="handlePageChange"></el-pagination>
          <el-pagination background layout="total" :total="total"></el-pagination>
        </div>
      </div>
    </div>




  </div>
</template>

<script>
import _ from 'lodash';
import MessageDialog from './MessageDialog.vue';
export default {
  components: { MessageDialog },
  props: {
    columns: {
      type: Array,
      required: true,
    },
    conditions: {
      type: Object,
      required: true,
    },
    fetchAllInfo: {
      type: Function,
      required: true,
    }
  },
  data() {
    return {
      data: [], // 表格数据
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
    };
  },
  watch: {
    conditions: {
      handler: _.debounce(function () {
        this.currentPage = 1;
        this.fetchAllEmpInfo(this.currentPage, this.pageSize);
      }, 300), // 300ms 防抖
      deep: true,
    },
  },
  methods: {
    handleAction(action, row) {
      if (action.type === 'update' || action.type === 'view') {
        this.$emit('fetch-single-data', row.id, action.type);
      } else {
        this.openMessageBox(row.id, action.type, action.name);
       
      }

    },
    async fetchAllEmpInfo(page, size) {
      const data = { conditions: this.conditions, pagination: { page, size } };
      try {
        const response = await this.fetchAllInfo(data);
        this.data = response.data.list;
        this.total = response.data.total;
      } catch (error) {
        console.error('分页获取信息失败:', error);
      }
    },

    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.fetchAllEmpInfo(newPage, this.pageSize);
    },
    handleSizeChange(newPageSize) {
      this.currentPage = 1; //切换页面尺寸时，页数重置为1(防止你的当前页，因为数据量不足，没数据，且当前分页按钮也没有的的问题)
      this.pageSize = newPageSize;
      this.fetchAllEmpInfo(this.currentPage, newPageSize);
    },
    openMessageBox(id, type, name) {
    this.$confirm('确认要' + name + '吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$emit('updateStatus', id, type);
      // this.$message({
      //   type: 'success',
      //   message: '状态更新成功!'
      // });
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消更新'
      });      
    });
  }
  },
  created() {
    this.fetchAllEmpInfo(this.currentPage, this.pageSize);
  },
};
</script>

<style scoped>
/* 可以根据需求添加样式 */
</style>
