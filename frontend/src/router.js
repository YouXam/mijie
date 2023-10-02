import * as VueRouter from 'vue-router'

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./pages/Home.vue'),
        },
        {
            path: '/gamerule',
            name: 'gamrule',
            component: () => import('./pages/Gamerule.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('./pages/About.vue'),
        }
    ]
})

export default router