import { createRouter, createWebHashHistory } from 'vue-router'

const Desk = () => import('../views/Desk.vue');
const Blockchain = () => import('../views/Blockchain.vue');

const routes = [
    {
        path: '/',
        redirect: '/desk'
    },
    {
        path: '/desk',
        component: Desk
    },
    {
        path: '/blockchain',
        component: Blockchain
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
