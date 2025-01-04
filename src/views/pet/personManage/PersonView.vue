<template>
    <div>
        <PasswordFormDialog :visible.sync="passwordFormDialogVisible" :id=id @close="passwordFormDialogVisible = false">
        </PasswordFormDialog>

        <CommonFormDialog title="员工信息" :status="'person'" :visible.sync="commonDialogVisible"
            :formItems="CommonFormDialogItems" :formData="person" formLabelWidth="100px" @close="commonDialogVisible = false" @confirm="handleViewConfirm"
            :fetchUpdate="updateEmp" :rule="this.CommonFormDialogRules" />
        <el-card>
            <div
                style="width: 100%; height: 200px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <h1 style="margin-bottom: 10px; font-size: 40px; font-style: bold;">
                    你好，{{ name + jobMap[job] }}!
                </h1>
                <clock></clock>
            </div>
        </el-card>
        <el-card style="margin-top: 20px;">
            <el-descriptions title="个人信息" :column="3" border>
                <template slot="extra">
                    <el-button type="primary" size="small" @click="passwordFormDialogVisible = true">修改账户密码</el-button>
                    <el-button type="primary" size="small" @click="commonDialogVisible = true">修改个人信息</el-button>
                </template>
                <el-descriptions-item v-for="(column, index) in personColumns" :key="index">
                    <template slot="label">
                        <i :class="column.icon"></i>
                        {{ column.label }}
                    </template>
                    <template v-if="column.type === 'transform'">
                        {{ column.option[person[column.prop]] }}
                    </template>
                    <template v-else-if="column.type === 'tag'">
                        <el-tag :type="column.style">{{ column.option[person[column.prop]] }}</el-tag>
                    </template>
                    <template v-else-if="column.type === 'image'">
                        <img :src="person[column.prop]" alt="Image" style="width: 100px; height: auto;">
                    </template>
                    <template v-else>
                        {{ person[column.prop] }}
                    </template>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>




</template>

<script>
import CommonFormDialog from "@/components/CommonFormDialog.vue";
import { queryOneEmp, updateEmp, deleteEmp } from '@/api/emp/empApi';
import PasswordFormDialog from '../../../components/PasswordFormDialog.vue';
import clock from '../../../components/ClockDisplay.vue';
import store from '@/store';
import { personColumns, CommonFormDialogItems, CommonFormDialogRules } from '@/api/person/personData';
import { fetchData } from '@/api/common/dataFetcherApi';
export default {
    components: {
        clock,
        PasswordFormDialog,
        CommonFormDialog
    },
    watch: {    //监听查询单个的值，返回给CommonFormDialogItems下的一些值
        person(newValue) {
            this.CommonFormDialogItems.forEach(item => {
                if (item.prop === 'image') {
                    item.props.imageUrl = newValue.image;
                    item.props.id = newValue.id;
                    item.props.fetchDelete = deleteEmp
                }
            });
        }
    },
    data() {
        return {
            commonDialogVisible: false,
            CommonFormDialogRules: CommonFormDialogRules,
            CommonFormDialogItems: CommonFormDialogItems,
            passwordFormDialogVisible: false,
            form: {
                history: '',
                now: ''
            },
            id: '',
            name: '',
            job: '',
            jobMap: [],
            person: {},
            personColumns
        };
    },
    methods: {
        async fetchDataOptions() {
            this.jobMap = await fetchData('empJob');

            personColumns.forEach((item) => {
                if (item.prop === 'job') {
                    item.option = this.jobMap;
                }
            });
            this.CommonFormDialogItems.forEach(item => {
                if (item.prop === 'job') {
                    item.options = this.jobMap;
                }
            });
        },
        ////////////查个单个对话框函数/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 确认时的操作
        handleViewConfirm() {
            this.commonDialogVisible = false;
            console.log("commonFormDialog确认操作触发数据:");
        },
        ////////////该界面所用api函数 //////////////////////////////////////////////////////////////////////////
        updateEmp,
        deleteEmp,
        async getYourSelfInfo() {
            try {
                this.person = (await queryOneEmp(this.id)).data;
                console.log(this.person);
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {

    },
    created() {
        this.id = store.getters.getGlobalVar.id
        this.name = store.getters.getGlobalVar.name;
        this.job = store.getters.getGlobalVar.job;
        this.getYourSelfInfo();
        this.fetchDataOptions();

    }
};
</script>