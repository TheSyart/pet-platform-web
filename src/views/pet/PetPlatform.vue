<template>
    <el-container class="platFrom-container">
        <el-header class="grey_color" style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 40px;">宠物护理平台</span>
            <el-dropdown style="display: flex; align-items: center;">
                <span style="font-size: 15px; margin-right: 8px;">{{ name }}</span>
                <i class="el-icon-user-solid" style="font-size: 30px;"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="loginBack">
                        <i class="el-icon-back"> 退出</i>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <i class="el-icon-setting"> 设置</i>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container style="height: 100%;">
            <el-aside style="height: 100%; border: 1px solid #ccc;"> <!-- 添加边框 -->
                <el-menu :default-openeds="openeds" style="height: 100%;" @open="handleOpen" @close="handleClose">
                    <!-- 营销统计管理 -->
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-data-line"></i>营销统计管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/home" tag="div" style="text-decoration: none;">
                                <el-menu-item index="1-1">首页</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <router-link to="/ipCount" tag="div" style="text-decoration: none;">
                                <el-menu-item index="1-2" v-if="hasPermission('ipCountPage')">访问统计</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <router-link to="/sale" tag="div" style="text-decoration: none;">
                                <el-menu-item index="1-3" v-if="hasPermission('salePage')">营销统计</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>
                    <!-- 人员信息管理 -->
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-s-custom"></i>人员信息管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/emp" tag="div" style="text-decoration: none;">
                                <el-menu-item index="2-1" v-if="hasPermission('empPage')">员工信息</el-menu-item>
                            </router-link>
                            <router-link to="/customer" tag="div" style="text-decoration: none;">
                                <el-menu-item index="2-2" v-if="hasPermission('customerPage')">客户信息</el-menu-item>
                            </router-link>
                            <router-link to="/dynamics" tag="div" style="text-decoration: none;">
                                <el-menu-item index="2-3" v-if="hasPermission('dynamicsPage')">客户动态</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>

                    <!-- 宠物信息管理 -->
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-medal-1"></i>宠物信息管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/pet" tag="div" style="text-decoration: none;">
                                <el-menu-item index="3-1" v-if="hasPermission('petPage')">宠物信息</el-menu-item>
                            </router-link>
                            <router-link to="/encyclopedia" tag="div" style="text-decoration: none;">
                                <el-menu-item index="3-2" v-if="hasPermission('encyclopediaPage')">宠物百科</el-menu-item>
                            </router-link>
                            <router-link to="/skill" tag="div" style="text-decoration: none;">
                                <el-menu-item index="3-3" v-if="hasPermission('skillPage')">喂养技巧</el-menu-item>
                            </router-link>
                        </el-menu-item-group>

                    </el-submenu>

                    <!-- 商城服务管理 -->
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-goods"></i>商城服务管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/shopping" tag="div" style="text-decoration: none;">
                                <el-menu-item index="4-1" v-if="hasPermission('shoppingPage')">宠物商城</el-menu-item>
                            </router-link>
                            <router-link to="/service" tag="div" style="text-decoration: none;">
                                <el-menu-item index="4-2" v-if="hasPermission('servicePage')">宠物服务</el-menu-item>
                            </router-link>
                            <router-link to="/order" tag="div" style="text-decoration: none;">
                                <el-menu-item index="4-3" v-if="hasPermission('orderPage')">订单管理</el-menu-item>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>

                    <!-- 信息管理 -->
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-setting"></i>系统信息管理
                        </template>
                        <el-menu-item-group>
                            <!-- <router-link to="/pet" tag="div" style="text-decoration: none;">
                                <el-menu-item index="5-1" v-if="hasPermission('petPage')">权限监管</el-menu-item>
                            </router-link>
                            <router-link to="/emp" tag="div" style="text-decoration: none;">
                                <el-menu-item index="5-2" v-if="hasPermission('empPage')">分类信息</el-menu-item>
                            </router-link>
                            <router-link to="/emp" tag="div" style="text-decoration: none;">
                                <el-menu-item index="5-3" v-if="hasPermission('empPage')">用户登录</el-menu-item>
                            </router-link>
                            <router-link to="/emp" tag="div" style="text-decoration: none;">
                                <el-menu-item index="5-4" v-if="hasPermission('empPage')">员工登录</el-menu-item>
                            </router-link> -->
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-main style="height: 100%; border: 1px solid #ccc;">
                <div>
                    <router-view></router-view> <!-- 显示路由内容的容器 -->
                </div>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            openeds: ['1'], // 默认展开第一个菜单
            name: ''
        };
    },
    methods: {
        handleOpen(index) {
            // 菜单项打开时，将 index 添加到 openeds
            if (!this.openeds.includes(index)) {
                this.openeds.push(index);
            }
        },
        handleClose(index) {
            // 菜单项关闭时，将 index 从 openeds 中移除
            const idx = this.openeds.indexOf(index);
            if (idx !== -1) {
                this.openeds.splice(idx, 1);
            }
        },
        loginBack() {
            // 清除本地存储
            localStorage.clear();

            this.name = ''; // 清空名字
            this.$router.push('/login');
        },

        getLoginName() {
            const token = localStorage.getItem('jwt'); // 确保获取最新的token
            if (token) {
                axios.post("/api/login/hello", {}, {
                    headers: {
                        'token': token
                    }
                }).then((result) => {
                    this.name = result.data.data;
                }).catch(error => {
                    console.error('错误:', error);
                });
            } else {
                this.name = ''; // 如果没有token，确保清空name
            }
        },
        hasPermission(permission) {
            const EmpPermission = JSON.parse(localStorage.getItem('permission')) || []; // 获取用户权限数组
            if (EmpPermission.includes(permission)) {
                return true;
            } else {
                return false;
            }
        }

    },
    mounted() {
        this.name = ''; // 清空名字
        this.getLoginName();
    }
};
</script>

<style></style>
