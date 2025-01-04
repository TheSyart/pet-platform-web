<template>
    <el-dialog :title="title" :visible="visible" @close="handleClose">
        <el-form :model="localFormData" class="form-container" status-icon :rules="rule" ref="commonForm">
            <!-- 动态生成表单项 -->
            <div v-for="(item, index) in filteredFormItems" :key="index" class="form-item-wrapper"
                :class="{ 'full-width-item': item.fullWidth }">
                <el-form-item :label="item.label" label-width="100px" :prop="item.prop">
                    <!-- el-input -->
                    <el-input v-if="item.type === 'el-input'" v-model="localFormData[item.prop]" v-bind="item.props">
                        <template v-if="item.unit" slot="append">{{ item.unit }}</template>
                    </el-input>

                    <!-- el-input-number -->
                    <el-input-number v-if="item.type === 'el-input-number'" v-model="localFormData[item.prop]"
                        v-bind="item.props">
                    </el-input-number>

                    <!-- el-select -->
                    <el-select v-if="item.type === 'el-select'" v-model="localFormData[item.prop]" v-bind="item.props">
                        <el-option v-for="(opt, optIndex) in item.options" :key="optIndex" :label="opt"
                            :value="optIndex" />
                    </el-select>

                    <!-- el-radio-group -->
                    <el-radio-group v-if="item.type === 'el-radio-group'" v-model="localFormData[item.prop]"
                        v-bind="item.props">
                        <el-radio v-for="(radio, radioIndex) in item.options" :key="radioIndex" :label="radio.value">
                            {{ radio.label }}
                        </el-radio>
                    </el-radio-group>

                    <!-- el-checkbox-group -->
                    <el-checkbox-group v-if="item.type === 'el-checkbox-group'" v-model="localFormData[item.prop]"
                        v-bind="item.props">
                        <el-checkbox v-for="(checkbox, checkboxIndex) in item.options" :key="checkboxIndex"
                            :label="checkbox.value">
                            {{ checkbox.label }}
                        </el-checkbox>
                    </el-checkbox-group>

                    <!-- el-date-picker -->
                    <el-date-picker v-if="item.type === 'el-date-picker'" v-model="localFormData[item.prop]"
                        v-bind="item.props" type="date">
                    </el-date-picker>

                    <!-- ImgUploader -->
                    <ImgUploader v-if="item.type === 'ImgUploader'" ref="ImgUploader"
                        @upload-success="handleUploadSuccess" @clearImage="handleClearImage" v-bind="item.props">
                    </ImgUploader>

                    <!-- el-table -->
                    <el-table v-if="item.type === 'el-table'" :data="localFormData[item.prop]" v-bind="item.props">
                        <el-table-column v-for="(col, index) in item.columns" :key="index" :prop="col.prop"
                            :label="col.label" :width="col.width" :align="col.align || 'center'">
                        </el-table-column>
                    </el-table>

                    <!-- el-button -->
                    <el-button v-if="item.type === 'el-button'" v-bind="item.props" :icon="item.icon"
                        @click="openDialog(item.formConfig)">
                        {{ item.label }}
                    </el-button>

                    <!-- el-steps -->
                    <el-steps v-if="item.type === 'el-steps' && localFormData[item.prop]"
                        :active="localFormData[item.prop]?.length" v-bind="item.props">
                        <el-step v-for="(step, index) in localFormData[item.prop]" :key="index"
                            :title="item.data[item.stepProp.title][step[item.stepProp.title]]"
                            :description="getDescription(step, item.stepProp.description, item.data)">
                        </el-step>
                    </el-steps>
                </el-form-item>
            </div>
        </el-form>
        <!-- 对话框底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" v-if="status === 'update'" @click="startUpdate">编辑</el-button>
                <el-button type="primary" v-if="status === 'update'" :disabled="submitDisabled"
                    @click="handleConfirm">确定</el-button>

                    <!-- 个人中心修改按钮 -->
                <el-button type="primary" v-if="status === 'person'" @click="handleConfirm">修改</el-button>
            </div>
        </template>

        <!-- 全局对话框对话框 -->
        <el-dialog :title="currentDialogConfig.title" :visible.sync="dialogVisible" :append-to-body="true">
            <CommonTable v-if="currentDialogConfig.type === 'table'" :columns="currentDialogConfig.columns"
                :data="currentDialogConfig.data" v-bind="currentDialogConfig.props">
            </CommonTable>

            <el-descriptions
                v-if="currentDialogConfig.type === 'descriptionMap' || currentDialogConfig.type === 'description'"
                class="margin-top" :column="currentDialogConfig.descriptionProp.columns"
                :size="currentDialogConfig.descriptionProp.size" :border="currentDialogConfig.descriptionProp.border">
                <!-- 动态渲染每个描述项 -->
                <el-descriptions-item v-for="(column, index) in currentDialogConfig.columns" :key="index">
                    <template slot="label">
                        <i :class="column.icon"></i>
                        {{ column.label }}
                    </template>
                    <!-- 根据 type 类型渲染不同的内容 -->
                    <template v-if="column.type === 'transform'">

                        {{ column.details[currentDialogConfig.data[column.prop]] }}
                    </template>
                    <template v-else>
                        {{ currentDialogConfig.data[column.prop] }}
                    </template>
                </el-descriptions-item>
            </el-descriptions>

            <template v-if="currentDialogConfig.type === 'descriptionMap'">
                <MapView :centerPoint="centerPoint"
                    :targetPoint="currentDialogConfig.data[currentDialogConfig.mapProp.targetPoint]"
                    style="height: 500px;" />
            </template>

        </el-dialog>
    </el-dialog>
</template>

<script>
import { formatDateTime } from '@/utils/commonFunction';
import { Message } from 'element-ui';
import ImgUploader from './ImgUploader.vue';
import CommonTable from './CommonTable.vue'; // 导入 CommonTable 组件
import MapView from "@/components/MapView.vue";
export default {
    components: {
        ImgUploader,
        CommonTable,
        MapView
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        rule: {
            type: Object,
            required: true
        },
        status: {
            type: String,
            required: false,
        },
        visible: {
            type: Boolean,
            required: true,
        },
        formItems: {
            type: Array,
            required: true,
        },
        formData: {
            type: Object,
            required: true,
        },
        fetchUpdate: {
            type: Function,
            default: () => {
            }
        },
    },
    data() {
        return {
            centerPoint: [117.24619443753649, 31.815551443626454], // 示例起点坐标
            localFormData: { ...this.formData },
            submitDisabled: true,
            initialImageData: this.formData.image, // 用于存储初始图片路径
            dialogVisible: false,
            currentDialogConfig: {},
            imagePassed: false  //判断照片回调地址，是否上传，如果没有将在关闭对话框时清除
        };
    },
    computed: {
        filteredFormItems() {
            return this.formItems.filter(item => this.shouldShowItem(item));
        }
    },
    watch: {
        // 监听条件变化
        formData: {
            handler(newData) {
                // 同步更新 localFormData
                this.localFormData = { ...newData };
                // 更新初始图片路径
                this.initialImageData = newData.image;
            },
            deep: true, // 深度监听对象的变化
        },
        visible: {
            handler(newVal) {
                if (!newVal) {
                    console.log("重置编辑框", newVal);
                    this.submitDisabled = true;
                }
            }
        },
    },
    methods: {
        getDescription(step, descriptionProps, data) {
            return descriptionProps.map(prop =>
                data[prop] ? data[prop][step[prop]] : step[prop]
            ).join(' ');
        },
        openDialog(formConfig) {
            this.currentDialogConfig = formConfig;
            this.currentDialogConfig.data = this.localFormData[formConfig.prop];
            console.log("打开对话框", JSON.stringify(this.localFormData[formConfig.prop]));
            this.dialogVisible = true;
        },
        shouldShowItem(item) {
            if (!item.show) {
                return true; // 如果没有 show 属性，默认显示
            }
            const { basis, value } = item.show;
            return this.localFormData[basis] === value;
        },
        startUpdate() {      //开始编辑
            this.formItems.forEach((item) => {
                if (item.edit) {
                    item.props.disabled = false;
                }
            });
            this.$forceUpdate(); // 强制更新视图
            this.submitDisabled = false;
            console.log("开始编辑", JSON.stringify(this.formData));
        },
        handleClose() {
            // 上传照片后，并没有保存，在关闭时，自动删除文件中上传照片
            if (!this.imagePassed && this.$refs.ImgUploader[0].uploadBackPath) {
                this.$refs.ImgUploader[0].deleteImage();
            }

            this.formItems.forEach((item) => {
                // 如果存在 item.disabledStatus，不重置 disabled 状态
                if (!item.disabledStatus) {
                    item.props.disabled = true;
                }
            });
            this.$refs.commonForm.resetFields(); // 重置表单字段

            this.$refs.ImgUploader[0].uploadBackPath = '';   // 因为imageUploader组件在我再次打开时，不会重置，所以手动清空路径
            this.imagePassed = false;  // 重置照片上传状态

            this.$emit('close'); // 触发父组件的关闭事件
        },
        handleConfirm() {       //保存编辑
            this.$refs.commonForm.validate(async (valid) => {
                if (valid) {
                    const data = this.localFormData;
                    //循环判断date是否有日期,进行标准格式转化
                    this.formItems.forEach((item) => {
                        Object.keys(data).forEach(key => {
                            if (item.prop === key && item.isDate) {
                                data[key] = formatDateTime(data[key]);
                            }
                        });
                    });

                    // 检查图片路径是否发生变化
                    if (data.image === this.initialImageData) {
                        delete data.image; // 如果图片路径没有变化，则删除
                    }
                    this.updateOneInfo(data);
                    this.imagePassed = true;
                } else {
                    Message.error('表单验证失败!');
                }
            });
        },
        handleUploadSuccess(image) {     //上传照片成功返回照片回传地址
            console.log('照片回传地址:', image);
            this.localFormData.image = image; // 将响应数据保存到本地表单数据
        },
        async updateOneInfo(date) {
            console.log("updateOneInfo", JSON.stringify(date));
            try {
                const response = await this.fetchUpdate(date);
                Message.success(response.data || "更新成功!");
                this.$emit('confirm'); // 将数据传给父组件
            } catch (error) {
                Message.error(error.response?.data?.message || '更新失败!');
            }
        },
        // imageUploader 组件 清楚照片时，同步清除localFormData.image
        handleClearImage() {
            this.localFormData.image = '';
        },
    }
};
</script>

<style scoped>
.form-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;
}

.form-item-wrapper {
    margin-bottom: 20px;
    width: 100%;
}

.full-width-item {
    grid-column: span 3;
}

.el-form-item__content {
    width: 100% !important;
}

.el-input,
.el-select,
.el-date-picker {
    width: 100% !important;
}
</style>