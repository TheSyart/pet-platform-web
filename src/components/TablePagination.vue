<template>
  <div>
    <!-- 引用封装的 MessageDialog 组件 -->
    <MessageDialog ref="messageDialog" />
    <el-table :height="tableHeight" :data="data" class="table-container" border align="center" header-align="center"
      :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }">
      <el-table-column v-for="(col, index) in columns" :key="index" :prop="col.prop" :label="col.label"
        :width="col.width" :align="col.align || 'center'" v-bind="col.props">

        <template #default="{ row }">

          <!-- 常规操作列的转化 -->
          <template v-if="col.type === 'button'">
            <el-button v-for="(action, idx) in col.details.filter(item => item.value.includes(row.status))" :key="idx"
              :type="action.color" size="mini" @click="handleAction(action, row)">
              {{ action.name }}
            </el-button>
          </template>

          <!-- 常规状态列的转化 -->
          <template v-else-if="col.type === 'tag'">
            <el-tag :type="col.details[0].color[row.status]" size="mini">
              {{ col.details[0].name[row.status] }} </el-tag>
            <el-tag v-for="(detail, index) in filteredDetails(col.details[1], row)" :key="index" :type="detail.color"
              size="mini">
              {{ detail.name }}
            </el-tag>
          </template>

          <!-- 特定操作列的转化(order) -->
          <template v-if="col.type === 'specialButton'">
            <el-button v-for="(action, idx) in col.details.filter(item => item.value.includes(row[col.prop]))"
              :key="idx" :type="action.color" size="mini" @click="handleAction(action, row)">
              {{ action.name }}
            </el-button>
          </template>

          <!-- 特定状态列的转化(order) -->
          <template v-else-if="col.type === 'specialTag'">
            <el-tag :type="col.details[0].color[row[col.prop]]" size="mini">
              {{ col.details[0].name[row[col.prop]] }} </el-tag>
          </template>

          <!-- null检测状态转化 -->
          <template v-else-if="col.type === 'null'">
            {{ row[col.prop] || col.details[0].name }}
          </template>

          <!-- 字典转化 -->
          <template v-else-if="col.type === 'transform'">
            {{ col.details[row[col.prop]] }}
          </template>

          <!-- 单位增加 -->
          <template v-else-if="col.type === 'unit'">
            {{ row[col.prop] + col.details[0].name }}
          </template>

          <!-- 合并列值 -->
          <template v-else-if="col.type === 'merge'">
            {{ (col.details.map(detail => row[detail]).filter(value => value !== undefined && value !== null).join(' '))
              || "无" }}
          </template>

          <template v-else>
            {{ row[col.prop] }}
          </template>

        </template>

      </el-table-column>
    </el-table>
    <!-- 分页部分 -->
    <div style=" height: 30px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">

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
</template>

<script>
import _ from 'lodash';
import MessageDialog from './MessageDialog.vue';
export default {
  components: { MessageDialog },
  props: {
    tableHeight: {
      type: String,
      default: '500px',
    },
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
  computed: {
    filteredDetails() {
      return (details, row) => {
        
        if(!details){
          return [];
        }
    
        const { name, extra, value, color } = details;
        // 将对象拆分为数组
        const filteredArray = name.map((nameItem, index) => ({
          name: nameItem,
          extra: extra[index],
          value: value[index],
          color: color[index],
        })).filter(detail => {
          // 检查 extra 和 value 是否匹配
          return row[detail.extra] === detail.value;
        });
        // 如果过滤后的数组为空，返回空数组
        return filteredArray.length > 0 ? filteredArray : [];
      }
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
        this.fetchAllOneObjectInfo(this.currentPage, this.pageSize);
      }, 300), // 300ms 防抖
      deep: true,
    },
  },
  methods: {
    handleAction(action, row) {
      const pass = action.pass ? row[action.pass] : row.id;
      //编辑查看订单，type为字符串
      if (action.type === 'update' || action.type === 'view') {
        this.$emit('fetch-single-data', row.id, action.type);

        //更新订单状态，type为对象
      } else if (typeof action.type === 'object' && action.type !== null) {
        // 检查 action.type 对象的属性
        if (action.type.basis && action.type.basisValues && action.type.values) {
          if (action.type.basisValues.includes(row[action.type.basis])) {
            // 查找 row[action.type.basis] 在 action.type.basisValues 中的索引
            const index = action.type.basisValues.indexOf(row[action.type.basis]);
            // 执行相应的操作
            this.openMessageBox(pass, action.type.values[index], action.name);
          }
        }

        //更新订单状态，type只为状态码
      } else {
        this.openMessageBox(pass, action.type, action.name);
      }

    },
    async fetchAllOneObjectInfo(page, size) {
      const data = { conditions: this.conditions, pagination: { page, size } };
      try {
        const response = await this.fetchAllInfo(data);
        this.data = response.data.list;
        this.$emit('fetch-all-data', this.data);
        this.total = response.data.total;
        console.log(this.data);

      } catch (error) {
        console.error('分页获取信息失败:', error);
      }
    },

    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.fetchAllOneObjectInfo(newPage, this.pageSize);
    },
    handleSizeChange(newPageSize) {
      this.currentPage = 1; //切换页面尺寸时，页数重置为1(防止你的当前页，因为数据量不足，没数据，且当前分页按钮也没有的的问题)
      this.pageSize = newPageSize;
      this.fetchAllOneObjectInfo(this.currentPage, newPageSize);
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
    this.fetchAllOneObjectInfo(this.currentPage, this.pageSize);
  },
};
</script>

<style scoped>
/* 可以根据需求添加样式 */
</style>
