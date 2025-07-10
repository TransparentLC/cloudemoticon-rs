import { createRouter, createWebHashHistory } from 'vue-router';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/emoticon/:key([\\dA-Za-z]*)',
            component: () => import('./pages/emoticon.vue'),
            meta: {
                keepAlive: true,
                noPadding: true,
            },
        },
        {
            path: '/editor',
            component: () => import('./pages/editor.vue'),
            meta: {
                keepAlive: true,
                noPadding: true,
            },
        },
        {
            path: '/config',
            component: () => import('./pages/config.vue'),
            meta: {
                keepAlive: true,
            },
        },
        {
            path: '/about',
            component: () => import('./pages/about.vue'),
            meta: {
                keepAlive: true,
            },
        },
        {
            path: '/:path(.*)*',
            redirect: '/about',
        },
    ],
});
