import { hasValue, saveLocal, getLocal } from '@/util/tool';
import Config from '@/config';
const mustions = {
  // 当前是否已经挂在了路由列表
  setHasRouterlist(state, flag) {
    state.hasRouterlist = flag;
  },
  // 当前已打开的路由便签
  setMenuTags(state, list) {
    const delKeepAliveName = state.keepAliveRouter.indexOf(list.name);

    if (!hasValue('name', list.name, state.menuTags)) {
      state.menuTags.push(list);
      saveLocal('menuTags', state.menuTags);
      if (delKeepAliveName === -1) {
        state.keepAliveRouter.push(list.name);
        saveLocal('keepAliveRouter', state.keepAliveRouter);
      }
    }
  },
  //
  setHasOpenIndex(state, status) {
    state.hasOpenIndex = status;
  },
  // 重置当前已打开的路由便签 (关闭全部 / 关闭其他)
  setMenuTagsList(state, list) {
    let keepName = [],
      tabs = [];

    state.closeAllTab = true;
    if (list.length) {
      keepName = [state.openPage];
      tabs = list;
    }
    state.menuTags = tabs;
    state.keepAliveRouter = keepName;
    saveLocal('keepAliveRouter', keepName); // 缓存当前keep-live路由名单
    saveLocal('menuTags', tabs); // 当前打开的tabs菜单
  },
  // 当前是否点击了关闭全部tab
  setCloseAllTab(state, status) {
    state.closeAllTab = status;
  },
  // 删除当前储存vuex路由标签
  setDelMenuTage(state, name) {
    let list = [];

    list = [...state.menuTags];

    // 删除缓存
    const delKeepAliveName = state.keepAliveRouter.indexOf(name);

    if (delKeepAliveName > -1) {
      state.keepAliveRouter.splice(delKeepAliveName, 1);
      saveLocal('keepAliveRouter', state.keepAliveRouter);
    }

    let goNextTage;

    for (const i in list) {
      if (list[i].name === name) {
        const j = parseInt(i, 10);

        goNextTage = undefined;
        if (list[j + 1]) {
          goNextTage = list[j + 1].name;
        } else {
          goNextTage = list[j - 1] ? list[j - 1].name : Config.homeName;
        }
        if (state.openPage === name) {
          state.openPage = goNextTage;
        }
        list.splice(i, 1);
        state.menuTags = list;
        saveLocal('menuTags', list);

        return;
      }
    }
  },
  setOpenPage(state, name) {
    state.openPage = name;
    saveLocal('openPage', name);
  },
  setLoadingCont(state, flag) {
    state.loadingCont = flag;
  },
  setMeanOperation(state, meanOperation) {
    state.meanOperation = meanOperation;
    saveLocal('meanOperation', state.meanOperation);
  },
  setWhritRouterList(state, list) {
    state.whritRouterList = list;
  },
  setMenuList(state, menuList) {
    state.menuList = menuList;
    saveLocal('menuList', state.menuList);
  },
  setMenuDataList(state, menuDataList) {
    state.menuDataList = menuDataList;
    saveLocal('menuDataList', state.menuDataList);
  },
  // 设置全局参数
  setCommon(state, option) {
    state.common = {
      ...status,
      ...option,
    };
    saveLocal('common', state.common);
  },
  // 设置编辑页面参数
  setCurrentEditData(state, option) {
    state.currentEditData = {
      ...status,
      ...option,
    };
  },
  // 设置动态路由参数
  setDynamicMenuList(state, option) {
    state.dynamicMenuList = {
      ...status,
      ...option,
    };
  },
  // 根据路由设置面包屑
  setBreadcrumbItem(state, list) {
    state.breadcrumb = list;
  },
};

export default mustions;
