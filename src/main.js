// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import AFTableColumn from '@/util/af-table-column';
import axios from 'axios';
import App from './App';
import router from './router';
import routers from 'router/routers';
import store from '@/store';
import ElementUI from 'element-ui';
import mixin from 'util/mixin';
import { creatMenuByRouters } from 'util/util';
import { getLocal } from 'util/tool';
import echarts from 'echarts';
import rem from 'util/rem.js';
import '@/common/fonts/iconfont.js';

require('!style-loader!css-loader!less-loader!common/css/reset.less'); // 重置全局默认样式
require('!style-loader!css-loader!common/fonts/iconfont.css'); // 引用第三方icon
require('!style-loader!css-loader!element-ui/lib/theme-chalk/index.css'); // 引用饿了么样式
require('!style-loader!css-loader!less-loader!common/css/resetElementUi.less'); // 重置饿了么某部分样式

require('util/prototype');
import Cookies from '@/util/jsCookie';
import * as filters from '@/util/filter';
// axios.defaults.headers.common['Cookie'] = 'ssss';

Vue.use(ElementUI);
// 定义字体比例
const fontRate = {
  CHAR_RATE: 3, // 汉字比率
  NUM_RATE: 0.65, // 数字
  OTHER_RATE: 1, // 除汉字和数字以外的字符的比率
};
const fontSize = 16;

Vue.use(AFTableColumn, {
  fontRate,
  fontSize,
});
Vue.prototype.$Cookies = Cookies;
Vue.config.productionTip = false;

// 定义全局方法
Object.keys(filters).forEach((key) => {
  Vue.prototype[`$${key}`] = filters[key];
});

Vue.mixin(mixin);
/* eslint-disable no-new */

// Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;

// 刷新页面后，路由表里会只剩下本地定义的 ，没有登录后添加的，所以这里再处理一下
const permission = getLocal('menuDataList') ? getLocal('menuDataList') : null;

if (permission) {
  const menuList = creatMenuByRouters(routers, permission);

  router.addRoutes(menuList);
  router.options.routes.push(...menuList);
  store.commit('setMenuList', menuList);
}
const vueInstance = new Vue({
  router,
  store,
  components: {
    App,
  },
  render: (h) => h(App),
}).$mount('#app');

window.onbeforeunload = function () {
  vueInstance.$destroy();
};
