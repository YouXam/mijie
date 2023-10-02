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
        },
        {
            path: '/graph',
            name: 'graph',
            component: () => import('./pages/Graph.vue'),
        }
    ]
})

export default router