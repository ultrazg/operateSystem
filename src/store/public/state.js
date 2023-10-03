import Cookies from 'js-cookie';
import { getLocal } from 'util/tool';
const state = {
  hasRouterlist: false, // 是否已经加载路由页面组
  menuTags: getLocal('menuTags') || [], // 当前打开的tabs页面标签组
  openPage: getLocal('openPage'), // 当前打开页面
  loadingCont: false,
  hasOpenIndex: false, // 当前是否已经打开过首页存在缓存
  closeAllTab: false, // 当前是否点击了关闭全部tab (记录清空操作放在首页进行,没有缓存下首页打开有需要时间,会有卡顿情况)
  meanOperation: getLocal('meanOperation') || {}, // 当前菜单权限
  keepAliveRouter: getLocal('keepAliveRouter') || [], // keepAlive 缓存起来做跳过白名单
  whritRouterList: getLocal('whritRouterList') || [], // 路由白名单,
  common: getLocal('common') || {},
  currentEditData: getLocal('currentEditData') || {},
  dynamicMenuList: getLocal('dynamicMenuList') || [],
  menuList: getLocal('menuList') || [],
  menuDataList: getLocal('menuDataList') || [],
  breadcrumb: [], // 面包屑数据
};

export default state;
