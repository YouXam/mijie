import * as VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { user } from '@/tools/bus'

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
            path: '/hint',
            name: 'hint',
            component: () => import('./pages/Hint.vue'),
            meta: { title: '题目' }
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
            path: '/record/:pid?',
            name: 'record',
            component: () => import('./pages/Record.vue'),
            meta: { title: '提交记录' }
        },
        {
            path: '/gameover',
            name: 'gameover',
            component: () => import('./pages/Gameover.vue'),
            meta: { title: '游戏结束' }
        },
        {
            path: '/rank',
            name: 'rank',
            component: () => import('./pages/Rank.vue'),
            meta: { title: '排行榜' }
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('./pages/UsersList.vue'),
            meta: { title: '用户列表', admin: true }
        },
        {
            path: '/notice',
            name: 'notice',
            component: () => import('./pages/Notice.vue'),
            meta: { title: '公告' }
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('./pages/Admin.vue'),
            meta: { title: '管理面板', admin: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('./pages/NotFound.vue'),
            meta: { title: '404' }
        }
    ]
})
NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
    if (user.admin?.value < 1 && to.meta.admin) {
        next({ path: '/404', replace: true,  })
        return
    }
    document.title = to.meta.title ? to.meta.title + ' | 哈士奇的复仇' : '哈士奇的复仇'
    NProgress.start()
    next();
});


router.afterEach(() => {
    NProgress.done()
})


export default router