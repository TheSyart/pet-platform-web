<template>
    <el-main>
        <!-- 使用 DataFetcher 组件获取数据 -->
        <DataFetcher dataType="petBreeds" @data-fetched="handlePetBreedsData" />
        <!-- 表单 -->
        <SearchFrom :searchFrom="searchFrom" :formItems="formItems" @submit="onSubmit" />


        <!-- 新增百科对话框 -->
        <el-button type="primary" size="small" plain round @click="dialogFormVisible = true"
            style="height:30px;">新增百科</el-button>
        <el-dialog title="新增百科" :visible.sync="dialogFormVisible">
            <el-form :model="form" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto;">
                    <el-form-item label="宠物名:" :label-width="formLabelWidth">
                        <el-input v-model="form.petName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="宠物别名:" :label-width="formLabelWidth">
                        <el-input v-model="form.anotherName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="宠物类别:" :label-width="formLabelWidth">
                        <el-select v-model="form.parentId" placeholder="请选择宠物类别">
                            <el-option v-for="(item, index) in petBreedMap" :key="index" :label="item" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宠物体型:" :label-width="formLabelWidth">
                        <el-input v-model="form.petShape" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="宠物原产地:" :label-width="formLabelWidth">
                        <el-input v-model="form.petOrigin" autocomplete="off"></el-input>
                    </el-form-item>
                </div>

                <div style="flex: 0 0 auto;">
                    <el-form-item label="宠物身高:" :label-width="formLabelWidth">
                        <el-input v-model="form.petHeight" autocomplete="off">
                            <template #append>cm</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="宠物体重:" :label-width="formLabelWidth">
                        <el-input v-model="form.petWeight" autocomplete="off">
                            <template #append>kg</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="宠物价格:" :label-width="formLabelWidth">
                        <el-input v-model="form.petPrice" autocomplete="off">
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="宠物寿命:" :label-width="formLabelWidth">
                        <el-input v-model="form.petLife" autocomplete="off">
                            <template #append>年</template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="介绍内容:" :label-width="formLabelWidth">
                        <el-input v-model="form.content" autocomplete="off" type="textarea" :rows="3"></el-input>
                    </el-form-item>
                </div>

                <div style="flex: 0 0 auto;">
                    <el-form-item label="头像:" :label-width="formLabelWidth" style="margin-bottom: 0;">
                        <ImgUploader type="encyclopedia/details" @upload-success="handleUploadSuccess"
                            ref="imgUploader" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearForm">取 消</el-button>
                <el-button type="primary" @click="addNewEncyclopedia">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 表格 -->
        <el-table class="table-container" :data="tableData" border align="center" header-align="center"
            :header-cell-style="{ backgroundColor: '#f5f5f5', color: '#333' }" height="600px">
            <el-table-column v-for="column in columns" :key="column.prop" :label="column.label" :prop="column.prop"
                align="center">

                <!-- 使用一个模板处理 status 和其他列 -->
                <template #default="{ row }">

                    <template v-if="column.label === '操作'">
                        <el-button v-if="row.status === 0" type="primary" size="mini"
                            @click="viewEncyclopediaInfo(row.id, 0)">编辑</el-button>
                        <el-button v-if="row.status === 0" type="danger" size="mini">删除</el-button>
                        <el-button v-if="row.status === 1" type="warning" size="mini"
                            @click="viewEncyclopediaInfo(row.id, 1)">查看</el-button>
                        <el-button v-if="row.status === 1" type="success" size="mini">发布</el-button>
                    </template>

                    <template v-else-if="column.label === '状态'">
                        <el-tag v-if="row.status == 0" type="success">已发布</el-tag>
                        <el-tag v-if="row.status == 1" type="danger">已下线</el-tag>
                    </template>

                    <template v-else-if="column.prop === 'parentId'">
                        {{ petBreedMap[row.parentId] }}
                    </template>

                    <template v-else-if="column.prop === 'petPrice'">
                        {{ row.petPrice + "元" }}
                    </template>

                    <template v-else-if="column.prop === 'petLife'">
                        {{ row.petLife + "年" }}
                    </template>

                    <!-- 默认渲染其他列的值 -->
                    <template v-else>
                        {{ row[column.prop] }}
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <!-- 百科对话框 -->
        <el-dialog title="宠物百科信息" :visible.sync="dialogOneEncyclopediaVisible" @close="clearOneService">
            <el-form :model="OneEncyclopedia" style="width: 400px; display: flex;">
                <div style="flex: 0 0 auto;">
                    <el-form-item label="宠物名:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.petName" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="宠物别名:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.anotherName" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="宠物类别:" :label-width="formLabelWidth">
                        <el-select v-model="petBreedLabel" disabled>
                            <el-option v-for="(item, index) in petBreedMap" :key="index" :label="item" :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宠物体型:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.petShape" autocomplete="off" disabled></el-input>
                    </el-form-item>
                </div>
                <div style="flex: 0 0 auto;">
                    <el-form-item label="宠物身高:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.petHeight" autocomplete="off" disabled>
                            <template #append>cm</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="宠物体重:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.petWeight" autocomplete="off" disabled>
                            <template #append>kg</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="宠物价格:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.petPrice" autocomplete="off" disabled>
                            <template #append>元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="宠物寿命:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.petLife" autocomplete="off" disabled>
                            <template #append>年</template>
                        </el-input>
                    </el-form-item>
                </div>
                <div style="flex: 0 0 auto;">
                    <el-form-item label="宠物原产地:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.petOrigin" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="介绍内容:" :label-width="formLabelWidth">
                        <el-input v-model="OneEncyclopedia.content" autocomplete="off" disabled type="textarea"
                            :rows="3"></el-input>
                    </el-form-item>
                    <el-form-item label="宠物照片:" :label-width="formLabelWidth" style="margin-bottom: 0;">
                        <img :src="OneEncyclopedia.image_path" alt="宠物照片" style=" height: 180px;" />
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOneEncyclopediaVisible = false">取 消</el-button>
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
import SearchFrom from '../../Component/SearchFrom.vue';
import ImgUploader from '../../Component/ImgUploader.vue';
import DataFetcher from '../../Component/DataFetcher.vue';
import CommonData from '../../Component/CommonData.js'; // 导入 CommonData 数据文件
export default {
    components: {
        SearchFrom,
        DataFetcher,
        ImgUploader
    },
    computed: {
        petBreedLabel() {
            return this.petBreedMap[this.OneEncyclopedia.parentId] || '';
        },
        formItems() {
            return [
                {
                    label: '宠物名',
                    component: 'el-input',
                    prop: 'petName',
                    props: { placeholder: '宠物名', style: { width: this.formItemWidth } }
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
                    options: this.statusMap
                },
                {
                    label: '宠物类别',
                    component: 'el-select',
                    prop: 'petSpecies',
                    props: {
                        placeholder: '宠物类别',
                        clearable: true,
                        style: { width: this.formItemWidth }
                    },
                    options: this.petBreedMap
                }
            ];
        }

    },
    data() {
        return {
            ...CommonData,
            checkOrUpdate: "",   //查看一个时判断状态
            statusMap: [],
            petBreedMap: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            columns: [
                { label: '宠物名', prop: 'petName' },
                { label: '宠物别名', prop: 'anotherName' },
                { label: '宠物类别', prop: 'parentId' },
                { label: '宠物原产地', prop: 'petOrigin' },
                { label: '宠物寿命', prop: 'petLife' },
                { label: '宠物价格', prop: 'petPrice' },
                { label: '状态', prop: 'status' },
                { label: '操作', prop: 'status' }

            ],

            searchFrom: {
                petName: "",
                petSpecies: "",
                status: ""
            },
            dialogFormVisible: false,
            form: {
                parentId: "",
                petName: "",
                image_path: "",
                content: "",
                petWeight: "",
                petHeight: "",
                petLife: "",
                petOrigin: "",
                petShape: "",
                anotherName: "",
                petPrice: ""
            },
            formItemWidth: '105px',
            formLabelWidth: '100px',
            dialogOneEncyclopediaVisible: false,
            OneEncyclopedia: {
            }
        }
    },
    methods: {
        clearOneService() {
            this.OneEncyclopedia = {}; // 重置为初始状态
        },
        handlePetBreedsData(data) {
            this.petBreedMap = data;
        },
        clearForm() {
            this.dialogFormVisible = false; // 关闭对话框
            this.form = { // 初始化表单数据
                parentId: "",
                petName: "",
                image_path: "",
                content: "",
                petWeight: "",
                petHeight: "",
                petLife: "",
                petOrigin: "",
                petShape: "",
                anotherName: "",
                petPrice: ""
            };
            if (this.$refs.imgUploader && typeof this.$refs.imgUploader.clearImage === 'function') {
                this.$refs.imgUploader.clearImage(); // 清空图片
            }
        },
        viewEncyclopediaInfo(id, type) {
            this.checkOrUpdate = type;  //判断查看一个的状态
            this.dialogOneEncyclopediaVisible = true;
            axios.get("/api/encyclopedia/onePetDetails", {
                params: {
                    id: id
                },
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            }).then((result) => {
                this.OneEncyclopedia = result.data.data;
            }).catch(error => {
                console.error('错误:', error);
            });
        },
        handleUploadSuccess(responseData) {
            console.log('父组件收到响应数据:', responseData);
            // 在这里处理或保存从子组件收到的响应数据
            this.form.image_path = responseData;
        },
        onSubmit(formData) {
            this.searchFrom = formData;
            this.getEncyclopediaInformation();
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1;
            this.getEncyclopediaInformation();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getEncyclopediaInformation();
        },
        getEncyclopediaInformation() {
            const page = this.currentPage;
            const size = this.pageSize;
            const petName = this.searchFrom.petName;
            const petSpecies = this.searchFrom.petSpecies;
            const status = this.searchFrom.status;


            axios.post("/api/encyclopedia/queryAllEncyclopedia", {
                conditions: {
                    petName: petName,
                    petSpecies: petSpecies,
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
            })
                .then((result) => {
                    this.statusMap = this.status;
                    this.tableData = result.data.data.list;
                    this.total = result.data.data.total;
                }).catch(error => {
                    console.error('错误:', error);
                });
        },
        addNewEncyclopedia() {

            const parentId = this.form.parentId;
            const petName = this.form.petName;
            const image_path = this.form.image_path;
            const content = this.form.content;
            const petWeight = this.form.petWeight;
            const petHeight = this.form.petHeight;
            const petLife = this.form.petLife;
            const petOrigin = this.form.petOrigin;
            const petShape = this.form.petShape;
            const anotherName = this.form.anotherName;
            const petPrice = this.form.petPrice;

            axios.post("/api/encyclopedia/insertOneEncyclopedia", {
                parentId: parentId,
                petName: petName,
                image_path: image_path,
                content: content,
                petWeight: petWeight,
                petHeight: petHeight,
                petLife: petLife,
                petOrigin: petOrigin,
                petShape: petShape,
                anotherName: anotherName,
                petPrice: petPrice
            }, {
                headers: {
                    'token': `${localStorage.getItem('jwt')}`
                }
            })
                .then(response => {
                    console.log('成功:', response.data);
                    this.dialogFormVisible = false; // 成功后关闭对话框
                    this.clearForm();
                    this.getEncyclopediaInformation(); // 重新加载数据

                })
                .catch(error => {
                    console.error('错误:', error);
                    this.$message.warning(error.response.data);
                });

        }
    },
    mounted() {
        this.getEncyclopediaInformation();
    }
}

</script>

<style></style>