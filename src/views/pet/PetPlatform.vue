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
        <el-container style=" height: calc(100vh - 60px);">
            <el-aside style="height: 100%; min-width: 200px; width: 10%; background-color: #545c64;">
                <el-menu style="height: 100%; width: 100%;" background-color="#545c64" text-color="#fff"
                    active-text-color="#ffd04b" :unique-opened="true">
                    <!-- 营销统计管理 -->
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-data-line"></i>营销统计管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/home" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="1-1">首页</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <router-link to="/ipCount" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="1-2" v-if="hasPermission('ipCountPage')">访问统计</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                        <el-menu-item-group>
                            <router-link to="/sale" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="1-3" v-if="hasPermission('salePage')">营销统计</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>
                    <!-- 人员信息管理 -->
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-s-custom"></i>人员信息管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/emp" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="2-1" v-if="hasPermission('empPage')">员工信息</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/customer" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="2-2" v-if="hasPermission('customerPage')">客户信息</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/dynamics" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="2-3" v-if="hasPermission('dynamicsPage')">客户动态</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/converse" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="2-4" v-if="hasPermission('conversePage')">客户会话</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>
                    <!-- 个人信息管理 -->
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-s-custom"></i>个人管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/person" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="3-1" v-if="hasPermission('personPage')">个人中心</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>
                    <!-- 宠物信息管理 -->
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-medal-1"></i>宠物信息管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/pet" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="4-1" v-if="hasPermission('petPage')">宠物信息</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/encyclopedia" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="4-2"
                                        v-if="hasPermission('encyclopediaPage')">宠物百科</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/feeding" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="4-3" v-if="hasPermission('feedingPage')">喂养技巧</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>

                    <!-- 商城服务管理 -->
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-goods"></i>商城服务管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/shopping" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="5-1" v-if="hasPermission('shoppingPage')">宠物商城</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/service" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="5-2" v-if="hasPermission('servicePage')">宠物服务</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/order" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="5-3" v-if="hasPermission('orderPage')">订单管理</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>

                    <!-- 信息管理 -->
                    <el-submenu index="6">
                        <template slot="title">
                            <i class="el-icon-setting"></i>系统信息管理
                        </template>
                        <el-menu-item-group>
                            <router-link to="/pet" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="6-1" v-if="hasPermission('petPage')">权限监管</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/emp" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="6-2" v-if="hasPermission('empPage')">分类信息</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/test" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="6-3" v-if="hasPermission('testPage')">测试</el-menu-item>
                                </div>
                            </router-link>
                            <router-link to="/emp" v-slot="{ navigate, href }" custom>
                                <div style="text-decoration: none;" @click="navigate" :href="href">
                                    <el-menu-item index="6-4" v-if="hasPermission('empPage')">员工登录</el-menu-item>
                                </div>
                            </router-link>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main style="height: 100%;">
                <router-view style="height: 100%;"></router-view> <!-- 显示路由内容的容器 -->
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import store from '@/store';
import WebSocketService from '@/utils/WebSocketService';
export default {
    data() {
        return {
            EmpPermission: [],
            name: ''
        };
    },
    methods: {
        loginBack() {
            // 清除本地存储
            localStorage.clear();
            this.name = ''; // 清空名字
            this.$router.push('/login');
        },
        hasPermission(permission) {
            if (this.EmpPermission.includes(permission)) {
                return true;
            } else {
                return false;
            }
        }

    },
    mounted() {
        // 获取 Vuex 状态
        const globalVar = store.getters.getGlobalVar;
        this.name = globalVar.name;
        this.EmpPermission = globalVar.permission || []; // 获取用户权限数组 

        // 组件加载时连接 WebSocket
        WebSocketService.connect();
    }
};
</script>

<style></style>