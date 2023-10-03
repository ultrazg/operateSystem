import Vue from 'vue';
import VueRouter from 'vue-router';
import Config from '@/config';
import routes from './routers.js';
import { getLocal, delLocal, saveLocal, hasOneOf } from 'util/tool';
import { createBreadcrumb } from 'util/util';
import store from '@/store';
// 重写路由的push方法
const routerPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return routerPush.call(this, location, onResolve, onReject);
  }

  return routerPush.call(this, location);
};

Vue.use(VueRouter);

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    // base: Config.baseURL,
    routes,
  });

const router = createRouter();

router.beforeEach((to, from, next) => {
  // alert(to.name + ' ' + to.path)
  const userInfo = store.state.user;
  const { username } = store.state.user;
  const meanOperation = getLocal('meanOperation'),
    whritRouterList = getLocal('whritRouterList'); // 用户权限 && 白名单

  store.commit('setLoadingCont', true);
  if (!username) {
    delLocal('menuTags'); // page
    delLocal('whritRouterList'); // 可访问页面白名单
    delLocal('meanOperation'); // 当前页面权限
  }
  // if (userInfo && store.state.meanOperation.size === 0) {
  //   if (meanOperation && meanOperation.length > 0) {
  //     meanOperation.forEach(item => {
  //       store.commit('setMeanOperation', { key: item[0], value: item[1] })
  //     })
  //   }
  // }
  if (!username && to.name !== 'login') {
    // 未登录且要跳转的页面不是登录页
    saveLocal('pushName', to.name);
    next({
      name: 'login', // 跳转到登录页
    });
  } else if (!username && to.name === 'login') {
    // 未登陆且要跳 转的页面是登录页
    next(); // 跳转
  } else if (username && to.path === '/') {
    // 重定向首页
    next({
      name: Config.homeName,
    });
  } else if (username && to.name === 'login') {
    // 已登录且要跳转的页面是登录页
    if (meanOperation && whritRouterList) {
      // 已有权限表跟可访问的白名单
      next();
    } else {
      store.dispatch('getUserRoleRouter', userInfo).then((res) => {
        next({
          name: Config.homeName, // 跳转到homeName页
        });
      });
    }

    store.commit('setOpenPage', Config.homeName);
  } else if (meanOperation && whritRouterList && to.name) {
    const toName = to.name;

    next();
    store.commit('setOpenPage', toName);
  } else {
    store.dispatch('getUserRoleRouter', userInfo).then((res) => {
      next({
        name: Config.homeName, // 跳转到homeName页
      });
    });
  }
});

router.afterEach((to, from) => {
  createBreadcrumb(to.matched);
  store.commit('setLoadingCont', false);
});

export default router;
