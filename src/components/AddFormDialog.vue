<template>
    <el-dialog :title="title" :visible="visible" @close="handleClose">
        <el-form :model="localFormData" :label-width="formLabelWidth" status-icon :rules="rule" class="form-container"
            ref="addForm">

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
                <el-button @click.native="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>


<script>
import { formatDateTime } from '@/utils/commonFunction';
import { Message } from 'element-ui'; // 使用 Element UI 的消息提示
import ImgUploader from './ImgUploader.vue';
export default {
    components: {
        ImgUploader
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
        visible: {
            type: Boolean,
            required: true,
        },
        formItems: {
            type: Array,
            required: true,
        },
        formLabelWidth: {
            type: String,
            default: "80px",
        },
        addForm: {
            type: Object,
            required: true,
        },
        fetchInsert: {
            type: Function,
            required: true,
        },

    },
    computed: {
        filteredFormItems() {
            return this.formItems.filter(item => this.shouldShowItem(item));
        }
    },
    data() {
        return {
            localFormData: { ...this.addForm }
        };
    },
    watch: {
        addForm: {
            handler(newVal) {
                this.localFormData = { ...newVal }; // 监听 addForm 的变化并更新 localFormData
            },
            deep: true
        },
    },
    methods: {
        shouldShowItem(item) {
            if (!item.show) {
                return true; // 如果没有 show 属性，默认显示
            }
            const { basis, value } = item.show;
            return this.localFormData[basis] === value;
        },
        handleUploadSuccess(responseData) {
            console.log('照片回传地址:', responseData);
            this.localFormData.image = responseData; // 将响应数据保存到本地表单数据
        },
        handleClose() {
            this.$refs.addForm.resetFields(); // 重置表单字段
            this.$emit('close'); // 触发父组件的关闭事件
        },
        handleConfirm() {
            this.$refs.addForm.validate(async (valid) => {
                if (valid) {
                    this.postAddNewOne();
                } else {
                    Message.error('表单验证失败!');
                }
            });

        },
        handleCancel() {
            this.$refs.addForm.resetFields(); // 重置表单字段
            // 调用ImgUploader组件的 clearImage 方法
            this.$refs.ImgUploader[0].clearImage();
            this.$emit('cancel');
        },
        async postAddNewOne() {
            try {
                const data = this.localFormData;

                //循环判断date是否有日期,进行标准格式转化
                this.formItems.forEach((item) => {
                    Object.keys(data).forEach(key => {
                        if (item.prop === key && item.isDate) {
                            console.log(data[key]);
                            data[key] = formatDateTime(data[key]);
                        }
                    });
                });

                const response = await this.fetchInsert(data);
                console.log('成功:', response.data);
                this.addDialogVisible = false;

                Message.success(response.data); // 显示成功消息

                this.$emit('confirm');  // 通知父组件刷新

            } catch (error) {
                console.error('分页获取信息失败:', error);
            }
        },
        // imageUploader 组件 清楚照片时，同步清除localFormData.image
        handleClearImage() {
            this.localFormData.image = '';
        },
    },
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