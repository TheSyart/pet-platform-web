<template>
    <div>
        <el-card>
            <div
                style="width: 100%; height: 200px; text-align: center; display: flex; flex-direction: column; align-items: center;">
                <span style="margin-bottom: 10px; font-size: 30px; font-style: bold;">
                    你好，{{ name + jobMap[job] }}!
                </span>
                <clock></clock>
            </div>
        </el-card>
        <el-card style="margin-top: 20px;">
            <el-descriptions title="个人信息" :column="3" border>
                <template slot="extra">
                    <el-button type="primary" size="small">修改账户密码</el-button>
                    <el-button type="primary" size="small">修改个人信息</el-button>
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
import { personColumns } from '@/api/person/personData';
import clock from '../../../components/ClockDisplay.vue';
import store from '@/store';
import { queryOnePerson } from '@/api/person/personApi';
import { fetchData } from '@/api/common/dataFetcher';
export default {
    components: {
        clock
    },
    data() {
        return {
            name: '',
            job: '',
            jobMap: [],
            person: [],
            personColumns
        };
    },
    methods: {
        updateTime() {
            const now = new Date();
            this.now = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }); // 格式化为东八区时间
        },
        async fetchDataOptions() {
            this.jobMap = await fetchData('empJob');

            personColumns.forEach((item) => {
                if (item.prop === 'job') {
                    item.option = this.jobMap;
                }
            });
        },
        async getYourSelfInfo() {
            try {
                this.person = (await queryOnePerson(store.getters.getGlobalVar.id)).data;
                console.log(this.person);
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {

    },
    created() {
        this.getYourSelfInfo();
        this.fetchDataOptions();
        this.name = store.getters.getGlobalVar.name;
        this.job = store.getters.getGlobalVar.job;
    }
};
</script>