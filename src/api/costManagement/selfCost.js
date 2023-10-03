import api from 'util/axios';
const qs = require('qs');

/** 自建成本列表 */
export const getAllSelfCostList = (data) =>
  api.request({
    method: 'post',
    // url: '/api/cooperationFramework/getCooperationFrameworkList',
    url: '/api/selfCost/page',
    data,
  });

/** 查看自建项目成本详情 */
export const detailSelfCost = (id) =>
  api.request({
    method: 'post',
    url: `/api/selfCost/details/${id}`,
  });

/** 获取成本录入页面数据 */
export const costEntrySelfCost = (id) =>
  api.request({
    method: 'post',
    url: `/api/selfCost/costEntry/${id}`,
  });

/** 执行报销填写 */
export const addExpenses = (data) =>
  api.request({
    method: 'post',
    url: '/api/selfCost/addExpenses',
    data,
  });

/** 获取成本录入页面数据 */
export const costExport = (data) =>
  api.request({
    method: 'post',
    url: '/api/selfCost/export',
    data,
    responseType: 'blob',
  });

/** 承揽自建成本详情 */
export const cooperationFrameworkDetail = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationFramework/${id}`,
  });

/** 新增自建成本 */
export const addcooperationFramework = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationFramework/addCooperationFramework',
    data,
  });

/** 更新自建成本 */
export const updatecooperationFramework = (data) =>
  api.request({
    method: 'PUT',
    url: '/api/cooperationFramework/updateCooperationFramework',
    data,
  });

/** 删除自建成本 */
export const cooperationFrameworkDel = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/cooperationFramework/${id}`,
  });

/** 删除自建成本 */
export const handleExport = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/cooperationFramework/${id}`,
  });
