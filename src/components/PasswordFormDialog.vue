<template>
    <el-dialog title="修改密码" :visible="localVisible" width="25%" @close="handleClose">
        <el-form :model="form" :rules="rules" ref="passwordForm">
            <el-form-item label="旧密码" label-width="100px" prop="history">
                <el-input v-model="form.history" type="password" show-password autocomplete="off" style="width: 100%;">
                    <i slot="suffix" v-if="historyPasswordValid === 'loading'"
                        class="el-input__icon el-icon-loading"></i>
                    <i slot="suffix" v-else-if="historyPasswordValid === true"
                        class="el-input__icon el-icon-success"></i>
                    <i slot="suffix" v-else-if="historyPasswordValid === false"
                        class="el-input__icon el-icon-error"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="新密码" label-width="100px" prop="now">
                <el-input v-model="form.now" type="password" show-password autocomplete="off" style="width: 100%;">
                    <i slot="suffix" v-if="nowPasswordValid === 'loading'" class="el-input__icon el-icon-loading"></i>
                    <i slot="suffix" v-else-if="nowPasswordValid === true" class="el-input__icon el-icon-success"></i>
                    <i slot="suffix" v-else-if="nowPasswordValid === false" class="el-input__icon el-icon-error"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="确认新密码" status-icon label-width="100px" prop="ack">
                <el-input v-model="form.ack" type="password" show-password autocomplete="off" style="width: 100%;">
                    <i slot="suffix" v-if="ackPasswordValid === 'loading'" class="el-input__icon el-icon-loading"></i>
                    <i slot="suffix" v-else-if="ackPasswordValid === true" class="el-input__icon el-icon-success"></i>
                    <i slot="suffix" v-else-if="ackPasswordValid === false" class="el-input__icon el-icon-error"></i>
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleSubmit">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { updateEmpPassword } from '@/api/common/passwordApi';
import { Message } from 'element-ui';
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        visible: {
            type: Boolean,
            required: true
        }
    },
    data() {
        var validateHistoryPassword = async (rule, value, callback) => {
            this.historyPasswordValid = 'loading';

            if (value.length < 6 || value.length > 16) {
                this.historyPasswordValid = false;
                callback(new Error('长度要在 6 到 16 个字符'));
            } else {
                const isValid = await this.updatePassword(0, this.form.history);
                if (isValid) {
                    this.historyPasswordValid = true;
                    callback();
                } else {
                    this.historyPasswordValid = false;
                    callback(new Error('密码错误'));
                }
            }

        };
        var validateNowPassword = (rule, value, callback) => {
            this.nowPasswordValid = 'loading';

            this.nowPasswordValid = false;
            if (value.length < 6 || value.length > 16) {
                callback(new Error('长度要在 6 到 16 个字符'));
            } else if (value === this.form.history) {
                callback(new Error('新密码与旧密码一致'));
            } else {
                this.nowPasswordValid = true;
                callback();
            }

        };
        var validateAckPassword = (rule, value, callback) => {
            this.ackPasswordValid = 'loading';

            this.ackPasswordValid = false;
            if (value.length < 6 || value.length > 16) {
                callback(new Error('长度要在 6 到 16 个字符'));
            } else if (value === '') {
                callback(new Error('请再次输入新密码'));
            } else if (value !== this.form.now) {
                callback(new Error('两次输入密码不一致'));
            } else {
                this.ackPasswordValid = true;
                callback();
            }

        }
        return {

            localVisible: this.visible,
            historyPasswordValid: null, // loading: 验证中, true: 验证通过, false: 验证失败
            nowPasswordValid: null,
            ackPasswordValid: null,
            form: {
                history: '',
                now: '',
                ack: ''
            },
            rules: {
                history: [
                    { required: true, message: '请输入历史密码', trigger: 'blur' },
                    { validator: validateHistoryPassword, trigger: 'blur' }
                ],
                now: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: validateNowPassword, trigger: 'blur' }
                ],
                ack: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: validateAckPassword, trigger: 'blur' }
                ]
            }
        };
    },
    watch: {
        visible(newVal) {
            this.localVisible = newVal;
        }
    },
    methods: {
        handleClose() {
            this.resetForm();
            this.$emit('close');
        },
        handleCancel() {
            this.resetForm();
            this.$emit('update:visible', false);
        },
        resetForm() {
            this.localVisible = false;
            this.historyPasswordValid = null;
            this.nowPasswordValid = null;
            this.ackPasswordValid = null;
            this.$refs.passwordForm.resetFields(); // 重置表单字段
        },
        async updatePassword(stepId, password) {
            try {
                const data = { id: this.id, stepId: stepId, password: password };
                const response = await updateEmpPassword(data);
                console.log('response:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error:', error);
                return false;
            }
        },
        handleSubmit() {
            this.$refs.passwordForm.validate(async (valid) => {
                if (valid) {
                    try {
                        const response = await this.updatePassword(1, this.form.now);
                        console.log('response:', response);
                        Message.success(response || '修改密码成功!');
                        this.resetForm();
                    } catch (error) {
                        Message.error('修改密码失败!');
                    }

                } else {
                    Message.error('表单验证失败!');
                }
            });
        }
    }
}
</script>

<style scoped>
.el-input__icon.el-icon-loading {
    color: #909399;
    /* 加载图标颜色 */
}

.el-input__icon.el-icon-success {
    color: #67C23A;
    /* 成功图标颜色 */
}

.el-input__icon.el-icon-error {
    color: #F56C6C;
    /* 错误图标颜色 */
}
</style>