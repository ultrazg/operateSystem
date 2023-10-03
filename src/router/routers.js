/* eslint-disable */
/*
    title 标题
    hideInMenu: (false) 设为true后在左侧菜单不显示
    role: (null) 可访问该页面的权限数组[]
    hideChildenAlways: (false)  如果设置true则显示当前路由下的子级到左侧菜单
    icon: 该页面在左侧菜单、面包屑和标签导航处显示的图标
*/

const MainView = () =>
    import('components/mainView');
const sonView = () =>
    import('components/sonView') // 挂载
import Config from '@/config'


export const loginRoute = [
    // { path: '/', redirect: '/index/indexPage' },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import('components/login/login')
    }];
export default [
    {
        path: '/login',
        name: 'login',
        component: () =>
            import('components/login/login')
    },
    {
        path: '/index',
        name: 'index',
        component: MainView,
        meta: {
            hideInMenu: true,
            title: '首页',
            icon: 'iconfont icon-home'
        },
        children: [
            // 测试首页显示
            {
                path: "indexPage",
                name: "indexPage",
                component: () =>
                    import('view/indexPage/indexPage'),
                meta: {
                    title: "首页",
                    icon: "iconfont icon-dot",
                },
            },
            {
                path: 'updatePassword',
                name: 'updatePassword',
                component: () =>
                    import('components/updatePassword/updatePassword')
            },
        ]
    },

    // 目录
    {
        path: '/',
        name: '/',
        meta: {
            title: "首页",
            icon: "iconfont icon-tongyongleiyonghunan"
        },
        redirect: '/index/indexPage'
    },
    {
        path: '/error_404',
        name: 'error_404',
        component: () =>
            import('components/error_404')
    }
]