import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/petPlatform',
    name: 'petPlatform',
    component: () => import('../views/pet/PetPlatform.vue'),
    redirect: { name: 'home' }, // 设置重定向
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/pet/countManage/HomeView.vue'),
        meta: { requiresAuth: true, permission: ['homePage'] }
      },
      {
        path: '/sale',
        name: 'sale',
        component: () => import('../views/pet/countManage/SaleView.vue'),
        meta: { requiresAuth: true, permission: ['salePage'] }
      },
      {
        path: '/ipCount',
        name: 'ipCount',
        component: () => import('../views/pet/countManage/IpCountView.vue'),
        meta: { requiresAuth: true, permission: ['ipCountPage'] }
      },
      {
        path: '/emp',
        name: 'emp',
        component: () => import('../views/pet/peopleManage/EmpView.vue'),
        meta: { requiresAuth: true, permission: ['empPage'] }
      },
      {
        path: '/customer',
        name: 'customer',
        component: () => import('../views/pet/peopleManage/CustomerView.vue'),
        meta: { requiresAuth: true, permission: ['customerPage'] }
      },
      {
        path: '/dynamics',
        name: 'dynamics',
        component: () => import('../views/pet/peopleManage/DynamicsView.vue'),
        meta: { requiresAuth: true, permission: ['dynamicsPage'] }
      },
      {
        path: '/converse',
        name: 'converse',
        component: () => import('../views/pet/peopleManage/ConverseView.vue'),
        meta: { requiresAuth: true, permission: ['conversePage'] }
      },
      {
        path: '/pet',
        name: 'pet',
        component: () => import('../views/pet/petManage/PetView.vue'),
        meta: { requiresAuth: true, permission: ['petPage'] }
      },
      {
        path: '/encyclopedia',
        name: 'encyclopedia',
        component: () => import('../views/pet/petManage/EncyclopediaView.vue'),
        meta: { requiresAuth: true, permission: ['encyclopediaPage'] }
      },
      {
        path: '/feeding',
        name: 'feeding',
        component: () => import('../views/pet/petManage/FeedingView.vue'),
        meta: { requiresAuth: true, permission: ['feedingPage'] }
      },
      {
        path: '/shopping',
        name: 'shopping',
        component: () => import('../views/pet/storeManage/ShoppingView.vue'),
        meta: { requiresAuth: true, permission: ['shoppingPage'] }
      },
      {
        path: '/service',
        name: 'service',
        component: () => import('../views/pet/storeManage/ServiceView.vue'),
        meta: { requiresAuth: true, permission: ['servicePage'] }
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('../views/pet/storeManage/OrderView.vue'),
        meta: { requiresAuth: true, permission: ['orderPage'] }
      },
      {
        path: '/person',
        name: 'person',
        component: () => import('../views/pet/personManage/PersonView.vue'),
        meta: { requiresAuth: true, permission: ['personPage'] }
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('../views/pet/systemManage/TestView.vue'),
        meta: { requiresAuth: true, permission: ['testPage'] }
      },
    ]
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/pet/LoginView.vue'),
  }
];

const router = new VueRouter({
  mode: 'history',  // 设置模式为 history
  routes,           // 将routes传递给VueRouter
});

function getGlobalVar() {
  return store.getters.getGlobalVar; // 通过 Vuex 的 getter 获取
}


// 路由守卫
router.beforeEach((to, from, next) => {
  const globalVar = getGlobalVar(); // 调用 getGlobalVar 函数获取全局变量
  const jwt = globalVar.jwt;
  const EmpPermission = globalVar.permission || []; // 获取用户权限数组

  if (jwt) {
    if (to.meta.requiresAuth !== undefined) {
      if (EmpPermission.includes(to.meta.permission[0])) {
        return next();          // 有jwt且目标为权限符合，允许访问
      } else {
        return next('/home');   // 有jwt且目标为权限不符合，允许访问跳转到home页面
      }
    } else {
      return next();            // 有jwt且目标未设置权限，允许访问
    }
  } else {
    if (to.name === 'login') {
      return next();            // 未登录且目标为登录页，允许访问
    } else {
      return next('/login');    // 未登录且非登录页，重定向到登录
    }
  }
});

export default router; // 确保导出的是 router 实例
