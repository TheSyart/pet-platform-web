<template>
    <el-dialog :title="title" :visible="visible" @close="handleClose">
        <el-form :model="localFormData" :label-width="formLabelWidth" class="form-container">
            <!-- 动态生成表单项 -->
            <div v-for="(item, index) in formItems" :key="index" class="form-item-wrapper">
                <el-form-item :label="item.label" :label-width="formLabelWidth">
                    <component :is="item.type" v-model="localFormData[item.prop]" v-bind="item.props"
                        @upload-success="handleUploadSuccess">

                        <template v-if="item.type === 'el-select'">
                            <el-option v-for="(opt, optIndex) in item.options" :key="optIndex" :label="opt"
                                :value="optIndex" />
                        </template>

                        <ImgUploader v-if="item.type === 'ImgUploader'"></ImgUploader>
                    </component>
                </el-form-item>
            </div>
        </el-form>
        <!-- 对话框底部按钮 -->
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" v-if="status === 'update'" @click="startUpdate">编辑</el-button>
                <el-button type="primary" v-if="status === 'update'" :disabled="submitDisabled"
                    @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>


<script>
import { Message } from 'element-ui';
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
        status: {
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
        formData: {
            type: Object,
            required: true,
        },
        fetchUpdate: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            localFormData: { ...this.formData },
            submitDisabled: true,
            initialImageData: this.formData.image // 新增属性，用于存储初始图片路径
        };
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
        startUpdate() {      //开始编辑
            this.formItems.forEach((item) => {
                if(item.edit){
                item.props.disabled = false;
            }
            });
            this.$forceUpdate(); // 强制更新视图
           
            this.submitDisabled = false;
            console.log("开始编辑", JSON.stringify(this.formData));
        },
        handleClose() {
            this.formItems.forEach((item) => {
                item.props.disabled = true;
            });
            this.$emit('close'); // 触发父组件的关闭事件
        },
        handleConfirm() {       //保存编辑
            const data = this.localFormData;
            //循环判断date是否有日期,进行标准格式转化
            this.formItems.forEach((item) => {
                Object.keys(data).forEach(key => {
                    if (item.prop === key && item.isDate) {
                        data[key] = this.$formatDateTime(data[key]);
                    }
                });
            });

            // 检查图片路径是否发生变化
            if (data.image === this.initialImageData) {
                delete data.image; // 如果图片路径没有变化，则删除 image 字段
            }
            this.updateOneInfo(data);
        },
        handleUploadSuccess(responseData) {     //上传照片成功返回照片回传地址
            console.log('照片回传地址:', responseData);
            this.localFormData.image = responseData; // 将响应数据保存到本地表单数据
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

        }

    },
};
</script>

<style scoped>
.form-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 每行显示四个表单项 */
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