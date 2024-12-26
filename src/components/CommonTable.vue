<template>
  <div>

    <el-table :data="data" class="table-container" border align="center" header-align="center"
      :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="400px">
      <el-table-column v-for="(col, index) in columns" :key="index" :prop="col.prop" :label="col.label"
        :width="col.width" :align="col.align || 'center'">

        <template #default="{ row }">

          <!-- 常规状态列的转化 -->
          <template v-if="col.type === 'tag'">
            <el-tag :type="col.details[0].color[row.status]" size="mini">
              {{ col.details[0].name[row.status] }} </el-tag>
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

          <!-- 照片展示 -->
          <template v-else-if="col.type === 'image'">
            <img width="100%" :src="row[col.prop]" />
          </template>

          <template v-else>
            {{ row[col.prop] }}
          </template>

        </template>

      </el-table-column>
    </el-table>



  </div>
</template>

<script>
export default {
  name: 'CommonTable',
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  }
};
</script>

<style scoped>
/* 可以根据需求添加样式 */
</style>