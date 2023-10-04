import * as VueRouter from 'vue-router'

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./pages/Home.vue'),
            meta: { title: '首页' }
        },
        {
            path: '/gamerule',
            name: 'gamrule',
            component: () => import('./pages/Gamerule.vue'),
            meta: { title: '游戏规则' }
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('./pages/About.vue'),
            meta: { title: '关于' }
        },
        {
            path: '/graph',
            name: 'graph',
            component: () => import('./pages/Graph.vue'),
            meta: { title: '流程图' }
        },
        {
            path: '/start',
            name: 'start',
            component: () => import('./pages/Start.vue'),
            meta: { title: '开始游戏' }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./pages/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('./pages/Register.vue'),
            meta: { title: '注册' }
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('./pages/Settings.vue'),
            meta: { title: '账户设置' }
        },
        {
            path: '/game/:pid',
            name: 'game',
            component: () => import('./pages/Game.vue'),
            meta: { title: '游戏' }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('./pages/NotFound.vue'),
            meta: { title: '404' }
        }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? to.meta.title + ' | 解谜游戏' : '解谜游戏'
    next();
});
  

export default router