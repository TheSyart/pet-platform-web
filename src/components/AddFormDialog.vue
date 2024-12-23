<template>
    <el-dialog :title="title" :visible="visible" @close="handleClose">
        <el-form :model="localFormData" :label-width="formLabelWidth" class="form-container">

            <div v-for="(item, index) in formItems" :key="index" class="form-item-wrapper">
                <el-form-item :label="item.label" :label-width="formLabelWidth">
                    <component :is="item.type" v-model="localFormData[item.prop]" v-bind="item.props"
                        :disabled="item.disabled" @upload-success="handleUploadSuccess"
                        :ref="el => { if (el) imgUploaderRefs[index] = el }">

                        <template v-if="item.type === 'el-select'">
                            <el-option v-for="(opt, optIndex) in item.options" :key="optIndex" :label="opt"
                                :value="optIndex" />
                        </template>


                        <ImgUploader v-if="item.type === 'ImgUploader'">
                        </ImgUploader>
                    </component>




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
    data() {
        return {
            localFormData: { ...this.addForm },
            imgUploaderRefs: [], // 用于存储每个 ImgUploader 组件的引用
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
        handleUploadSuccess(responseData) {
            console.log('照片回传地址:', responseData);
            this.localFormData.image = responseData; // 将响应数据保存到本地表单数据
        },
        handleClose() {
            this.$emit('close'); // 触发父组件的关闭事件
        },
        handleConfirm() {
            this.postAddNewOne();
        },
        handleCancel() {
            // 遍历所有 ImgUploader 组件并调用 clearImage 方法
            this.imgUploaderRefs.forEach(ref => {
                if (ref && typeof ref.clearImage === 'function') {
                    ref.clearImage(); // 清空图片
                }
            });
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
                            data[key] = this.$formatDateTime(data[key]);
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
        }
    },
};
</script>

<style scoped>
.form-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 每行显示2个表单项 */
    grid-gap: 20px;
    /* 控制每个表单项之间的间距 */
}

.form-item-wrapper {
    margin-bottom: 20px;
    width: 100%;
}

/* 统一设置每个表单项的宽度 */
.el-form-item__content {
    width: 100% !important;
    /* 确保内容区域宽度一致 */
}

.el-input,
.el-select,
.el-date-picker {
    width: 100% !important;
    /* 确保各个组件宽度一致 */
}
</style>