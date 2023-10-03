// import state from './state';
import routers from 'router/routers';
import { creatMenuByRouters } from 'util/util';

export const menuList = (state, getters, rootState) => state.menuList;

export const menuTags = (state, getters, rootState) => state.menuTags; // 根据当前左侧菜单选中的值创建tags数组

export const openPage = (state, getters, rootState) => state.openPage; // 当前打开的页面

export const loadingCont = (state, getters, rootState) => state.loadingCont; // 窗体内部加载

export const keepAliveName = (state, getters, rootState) => state.keepAliveRouter; // 窗体内部加载

export const closeAllTab = (state, getters, rootState) => state.closeAllTab; // 当前是否点击了关闭全部tab (记录清空操作放在首页进行,没有缓存下首页打开有需要时间,会有卡顿情况)
export const hasOpenIndex = (state, getters, rootState) => state.hasOpenIndex; // 当前是否已经打开过首页存在缓存
export const common = (state, getters, rootState) => state.common;

export const currentEditData = (state, getters, rootState) => state.currentEditData;

export const dynamicMenuList = (state, getters, rootState) => state.dynamicMenuList;

export const breadcrumb = (state) => state.breadcrumb; // 面包屑
