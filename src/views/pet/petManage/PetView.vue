<template>
    <el-main>
        <!-- 使用 DataFetcher 组件获取宠物种类数据 -->
        <DataFetcher dataType="petBreeds" @data-fetched="handlePetBreedsData" />
        <!-- 使用 DataFetcher 组件获取宠物毛色种类数据 -->
        <DataFetcher dataType="petCoat" @data-fetched="handlePetCoatData" />
        <!-- 使用 DataFetcher 组件获取宠物详情数据 -->
        <DataFetcher dataType="petDetails" @data-fetched="handlePetDetailsData" />

        <!-- 表单 -->
        <SearchForm :searchForm="searchForm" :formItems="formItems" @submit="onSubmit" />


        <button style="height: 30px; visibility: hidden;"></button>
        <!-- 表格 -->
        <el-table class="table-container" :data="tableData" border align="center" header-align="center"
            :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="600px">
            <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
                align="center">
                <!-- 使用一个模板处理 status 和其他列 -->
                <template #default="{ row }">

                    <template v-if="column.label === '操作'">
                        <el-button v-if="row.status === 0" type="primary" size="mini"
                            @click="viewPetInfo(row.id, 0)">查看</el-button>
                        <el-button v-if="row.status === 0" type="danger" size="mini">删除</el-button>
                        <el-button v-if="row.status === 1" type="warning" size="mini"
                            @click="viewPetInfo(row.id, 1)">查看</el-button>
                        <el-button v-if="row.status === 1" type="success" size="mini">恢复</el-button>
                    </template>

                    <template v-else-if="column.label === '状态'">
                        <el-tag v-if="row.status == 0" type="success">正常</el-tag>
                        <el-tag v-if="row.status == 1" type="danger">删除</el-tag>
                    </template>

                    <!-- 如果是 pet_breed 列，显示对应的宠物品种 -->
                    <template v-else-if="column.prop === 'pet_breed'">
                        {{ breedsMap[row.pet_breed] }}
                    </template>

                    <!-- 如果是 pet_sex 列，显示对应的宠物性别 -->
                    <template v-else-if="column.prop === 'pet_sex'">
                        {{ genderMap[row.pet_sex] }}
                    </template>

                    <!-- 如果是 pet_details 列，显示宠物详情 -->
                    <template v-else-if="column.prop === 'pet_details'">
                        {{ detailsMap[row.pet_details] }}
                    </template>

                    <!-- 默认渲染其他列的值 -->
                    <template v-else>
                        {{ row[column.prop] }}
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <!-- 宠物信息对话框 -->
        <el-dialog title="宠物信息" :visible.sync="dialogOnePetVisible" @close="clearOneService">
            <el-form :model="OnePet" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto;">
                    <el-form-item label="宠物姓名:" :label-width="formLabelWidth">
                        <el-input v-model="OnePet.pet_name" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="主人姓名:" :label-width="formLabelWidth">
                        <el-input v-model="OnePet.name" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="宠物体重:" :label-width="formLabelWidth">
                        <el-input v-model="OnePet.pet_weight" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间:" :label-width="formLabelWidth">
                        <el-input v-model="OnePet.createDate" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="最后修改时间:" :label-width="formLabelWidth">
                        <el-input v-model="OnePet.modifyDate" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="宠物生日:" :label-width="formLabelWidth">
                        <el-date-picker v-model="OnePet.pet_birth" type="date" placeholder="选择日期"
                            disabled></el-date-picker>
                    </el-form-item>
                </div>
                <div style="flex: 0 0 auto;"> <!-- 固定宽度 -->
                    <el-form-item label="宠物毛色:" :label-width="formLabelWidth">
                        <el-select v-model="coatLabel" disabled>
                            <el-option v-for="(coat, index) in coatMap" :key="index" :label="coat" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宠物品种:" :label-width="formLabelWidth">
                        <el-select v-model="breedLabel" disabled>
                            <el-option v-for="(breed, index) in breedsMap" :key="index" :label="breed" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宠物性别:" :label-width="formLabelWidth">
                        <el-select v-model="genderLabel" disabled>
                            <el-option v-for="(gender, index) in genderMap" :key="index" :label="gender" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宠物备注:" :label-width="formLabelWidth">
                        <el-select v-model="detailsLabel" disabled>
                            <el-option v-for="(details, index) in detailsMap" :key="index" :label="details"
                                :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="头像:" :label-width="formLabelWidth" style="margin-bottom: 0;">
                        <img :src="OnePet.image_path" alt="宠物头像" style=" height: 180px;" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOnePetVisible = false">取 消</el-button>
                <el-button v-if="this.checkOrUpdate === 0">编 辑</el-button>
            </div>
        </el-dialog>




        <!-- 分页 -->
        <div style="height: 10%; width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <el-pagination background layout="sizes" :page-size="pageSize" :total="total"
                    @size-change="handleSizeChange" style="flex: 1; text-align: left;">
                </el-pagination>
                <div style="flex: 1; display: flex; justify-content: center;">
                    <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total"
                        @size-change="handleSizeChange" :current-page="currentPage"
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
                <div style="flex: 1; display: flex; justify-content: flex-end;">
                    <el-pagination background layout="jumper" style="margin-right: 10px;">
                    </el-pagination>
                    <el-pagination background layout="total" :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </el-main>
</template>



<script>
import axios from 'axios';
import SearchForm from '../../../components/SearchForm.vue';
import DataFetcher from '../../../components/DataFetcher.vue';
import CommonData from '../../../commonData/CommonData.js'; // 导入 CommonData 数据文件
export default {
    components: {
        DataFetcher,
        SearchForm
    },
    computed: {
        genderLabel() {
            return this.genderMap[this.OnePet.pet_sex] || '';
        },
        breedLabel() {
            return this.breedsMap[this.OnePet.pet_breed] || '';
        },
        detailsLabel() {
            return this.detailsMap[this.OnePet.pet_details] || '';
        },
        coatLabel() {
            return this.coatMap[this.OnePet.pet_coat] || '';
        },
        formItems() {
            return [
                {
                    label: '宠物姓名',
                    component: 'el-input',
                    prop: 'petName',
                    props: {
                        placeholder: '宠物姓名',
                        style: { width: this.formItemWidth }
                    }
                },
                {
                    label: '主人姓名',
                    component: 'el-input',
                    prop: 'userName',
                    props: {
                        placeholder: '主人姓名',
                        style: { width: this.formItemWidth }
                    }
                },
                {
                    label: '宠物品种',
                    component: 'el-select',
                    prop: 'petBreed',
                    props: {
                        placeholder: '宠物品种',
                        clearable: true,
                        style: { width: this.formItemWidth }
                    },
                    options: this.breedsMap // 依赖 breedsMap
                },
                {
                    label: '状态',
                    component: 'el-select',
                    prop: 'status',
                    props: {
                        placeholder: '状态',
                        clearable: true,
                        style: { width: this.formItemWidth }
                    },
                    options: this.status // 依赖 status
                },
                {
                    label: '注册日期',
                    component: 'el-date-picker',
                    prop: 'createdate',
                    props: {
                        type: 'datetimerange',
                        rangeSeparator: '至',
                        startPlaceholder: '开始日期',
                        endPlaceholder: '结束日期',
                        style: 'width: 360px;'
                    }
                }
            ];
        }

    },
    data() {
        return {
            ...CommonData,
            checkOrUpdate: "",   //查看一个时判断状态
            breedsMap: [], // 存储宠物品种数据
            genderMap: [], // 存储宠物性别
            detailsMap: [],// 存储宠物备注
            coatMap: [],   // 存储宠物毛色
            tableData: [],
            columns: [
                { label: '宠物姓名', prop: 'pet_name' },
                { label: '宠物品种', prop: 'pet_breed' },
                { label: '性别', prop: 'pet_sex' },
                { label: '宠物备注', prop: 'pet_details' },
                { label: '主人姓名', prop: 'name' },
                { label: '注册日期', prop: 'createDate' },
                { label: '最后修改日期', prop: 'modifyDate' },
                { label: '状态', prop: 'status' },
                { label: '操作', prop: 'status' }
            ],
            searchForm: {
                petName: "",
                userName: "",
                gender: "",
                status: "",
                petBreed: "",
                createdate: [],

            },
            currentPage: 1,
            pageSize: 10,
            total: 0,
            formItemWidth: '105px',
            formLabelWidth: '100px',
            dialogOnePetVisible: false,
            OnePet: {},
        };
    },

    methods: {
        clearOneService() {
            this.OnePet = {}; // 重置为初始状态
        },
        viewPetInfo(id, type) {
            this.checkOrUpdate = type;  //判断查看一个的状态
            this.dialogOnePetVisible = true; // 打开员工信息对话框
            axios.get("/api/myPet/queryOnePet", {
                params: {
                    id: id
                },
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            }).then((result) => {
                this.OnePet = result.data.data;
            }).catch(error => {
                console.error('错误:', error);
            });
        },
        handlePetBreedsData(data) {
            this.breedsMap = data; // 获取宠物品种    
        },
        handlePetCoatData(data) {
            this.coatMap = data; // 获取宠物毛色
        },
        handlePetDetailsData(data) {
            this.detailsMap = data; // 获取宠物详情
        },
        onSubmit(formData) {
            this.searchForm = formData;
            this.getPetInformation();
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1;
            this.getPetInformation();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getPetInformation();
        },
        getPetInformation() {
            //时间选择器自带的 X ，点击后会让值为null
            if (this.searchForm.createdate == null) {
                this.searchForm.createdate = [];
            }
            const page = this.currentPage;
            const size = this.pageSize;
            const petName = this.searchForm.petName;
            const userName = this.searchForm.userName;
            const gender = this.searchForm.gender;
            const status = this.searchForm.status;
            const petBreed = this.searchForm.petBreed;
            const begin = this.searchForm.createdate[0] ? this.$formatDateTime(this.searchForm.createdate[0]) : '';
            const end = this.searchForm.createdate[1] ? this.$formatDateTime(this.searchForm.createdate[1]) : '';


            axios.post("/api/myPet/queryAllPet", {
                conditions: {
                    page: page,
                    pageSize: size,
                    petName: petName,
                    userName: userName,
                    petBreed: petBreed,
                    gender: gender,
                    begin: begin,
                    end: end,
                    status: status
                },
                pagination: {
                    page: page,
                    size: size
                }
            }, {
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            }).then((result) => {
                this.genderMap = this.petSex;
                // this.detailsMap = this.petDetails;
                // this.coatMap = this.petCoat;
                this.tableData = result.data.data.list;
                this.total = result.data.data.total;
            })

        }

    },
    mounted() {
        this.getPetInformation();
    },
}
</script>

<style></style>